const path = require('path');
const ex = require('express');

const publicPath = path.join(__dirname, '../public');
// Set up a environment variable for Heroku
const port = process.env.PORT || 3000;
// Create a app variable to configure Express application
var app = ex();
// Config Express static middleware
app.use(ex.static(publicPath));


app.listen(port, () => {
	console.log(`Server is listening on port ${port}`);
});
