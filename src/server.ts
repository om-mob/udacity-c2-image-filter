import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

  /**************************************************************************** */

  app.get("/filteredimage", async (req: express.Request, res: express.Response) => {
    const { image_url } : { image_url: string }  = req.query
    if (!image_url) return res.status(400).send("Please provide image_url query param") // task 1
    
    // // check if the provided url is a valid image url
    // if (!/^https?:\/\/[a-z]*.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(image_url))
    //   return res.status(400).send(`${image_url} is Not a valid image url`)

    try {
      const processed_img_path: string = await filterImageFromURL(image_url) // task 2
      res.status(200).sendFile(processed_img_path) // task 3
      res.on('finish', () => deleteLocalFiles([processed_img_path])) // task 4
    } catch(e) {
      res.status(422).send(`Check the image url and try again`)
    } 
  })

  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();