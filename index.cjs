const express = require("express")
const path = require("path")
const multer = require("multer")
const app = express()
const PORT = 8080;
    

// View Engine Setup
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
    
var upload = multer({ dest: "./" })

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
  
        // Uploads is the Upload_folder_name
        cb(null, "./")
    },
    filename: function (req, file, cb) {
      cb(null, file.fieldname + "-" + Date.now()+".svg")
    }
  })
       
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;
    
var upload = multer({ 
    storage: storage,
    limits: { fileSize: maxSize },
    fileFilter: function (req, file, cb){
    
        // Set the filetypes, it is optional
        var filetypes = /svg/;
        var mimetype = filetypes.test(file.mimetype);
  
        var extname = filetypes.test(path.extname(
                    file.originalname).toLowerCase());
        
        if (mimetype && extname) {
            return cb(null, true);
        }
      
        cb("Error: File upload only supports the "
                + "following filetypes - " + filetypes);
      }       
  
// svg_file is the name of file attribute
}).single("svg_file");       
  
app.get("/",function(req,res){
    res.render("front-page");
})

app.post("/upload_convert",function (req, res, next) {
        
    // Error MiddleWare for multer file upload, so if any
    // error occurs, the image would not be uploaded!
    upload(req,res,function(err) {
  
        if(err) {
  
            // ERROR occurred (here it can be occurred due
            // to uploading image of size greater than
            // 1MB or uploading different file type)
            res.send(err)
        }
        else {
            res.send("file uploaded")

            const fs = require("fs").promises
            const { DOMParser } = require('xmldom')
            const canvas = require("canvas")
            const fetch = require('node-fetch')
            const {Canvg,presets} = require("canvg")

            const preset = presets.node({
                DOMParser,
                canvas,
                fetch
              });
              
              (async (output, input) => {
                const svg = await fs.readFile(input, 'utf8')
                const canvas = preset.createCanvas(800, 600)
                const ctx = canvas.getContext('2d')
                const v = Canvg.fromString(ctx, svg, preset)
              
                // Render only first frame, ignoring animations.
                await v.render()
              
                const png = canvas.toBuffer()
              
                await fs.writeFile(output, png)
              })(
                './png_file-1667814851988.png',
                './svg_file-1667814851988.svg'
              )
            
        }
        })
    })


// Take any port number of your choice which
// is not taken by any other process
app.listen(PORT,function(error) {
    if(error) throw error
        console.log("Server created Successfully on PORT", PORT)
})