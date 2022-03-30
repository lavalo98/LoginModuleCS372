const express = require('express')
const router = express.Router()
const fs = require('fs')

const Movie = require('./../Models/movieSchema')

router.get('/', (req, res) => {

    if(!req.session.loggedIn || req.session.loggedIn == false) {
      return res.render("login", {alertShow: "show", header: "Access Denied", message: "You are not logged in!"});
    }
  
    var movie_query = decodeURI(req._parsedUrl.query);
  
    Movie.find({"movieName" : movie_query})
    .then((result) => {
      //console.log(result[0].movieFileName);
  
      // Ensure there is a range given for the video
      range = req.headers.range;
      if (!range) {
        res.status(400).send("Requires Range header");
      }
  
      // get video stats
      const videoPath = "public/videos/" + result[0].movieFileName;
      const videoSize = fs.statSync(videoPath).size;
  
      // Parse Range
      // Example: "bytes=32324-"
      const CHUNK_SIZE = 10 ** 6; // 1MB
      const start = Number(range.replace(/\D/g, ""));
      const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
  
      // Create headers
      const contentLength = end - start + 1;
      const headers = {
        "Content-Range": `bytes ${start}-${end}/${videoSize}`,
        "Accept-Ranges": "bytes",
        "Content-Length": contentLength,
        "Content-Type": "video/mp4",
      };
  
      // HTTP Status 206 for Partial Content
      res.writeHead(206, headers);
  
      // create video read stream for this particular chunk
      const videoStream = fs.createReadStream(videoPath, { start, end });
  
      // Stream the video chunk to the client
      videoStream.pipe(res);
  
    }).catch((err) => {console.log(err);})
});

module.exports = router