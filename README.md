# Portfolio

Welcome to my portfolio! Originally, this repo started as a static HTML page - a homework requirement for the coding bootcamp I attended through UC Davis. After a number of updates and projects being added, the page got to be too large to handle. So, I decided to turn it into a Full-Stack application. The front-end has remained largely the same - a simple material design, contact information, and links to various projects. As for the back-end, now all projects are stored in a MySQL database, and an admin portal has been added, allowing projects to be added/edited.

## Organization

The app runs on Node.js, using the Express framework. Data is persisted to a MySQL database. Finally, views are generated using the Handlebars framework.

User authentication is handled via Passport.js. *All user passwords are encrypted before being persisted, using the bcrypt strategy*. (There is only one user - me - but security is not something to take lightly!)

This is a Full-Stack Web Application following the MVC design pattern.

## Accessing the App

My Portfolio is currently deployed to Heroku.

You may access the app here: [Portfolio -- Will Parks](https://ancient-plateau-19079.herokuapp.com/)

## Admin Portal

There is an admin portal, allowing me to manage projects displayed on the portfolio, but it isn't available for the public to see or use. It allows me to add new projects, add new software and technologies, upload project images, add new project links, and manage the stack/packages that should be shown for each project.

![AdminPortal](./public/assets/img/project-admin.gif)

## Technologies Used
<b>Built With</b>

- [Node.js](https://www.nodejs.org)
    - [Express](https://www.npmjs.com/package/express)
    - [MySQL](https://www.npmjs.com/package/mysql)
    - [Express Handlebars](https://www.npmjs.com/package/express-handlebars)
    - [Passport](http://www.passportjs.org/)
    - [bcryptjs](https://www.npmjs.com/package/bcryptjs)
    - [Sequelize](https://sequelize.org/)
- [MySQL](https://www.mysql.com)
- [Handlebars](https://handlebarsjs.com/)
- [select2](https://select2.org/)
- [AWS S3](https://aws.amazon.com/s3)

## Credits

- <b>Developed By: </b>  Will Parks -- [wparks08](https://www.github.com/wparks08)

## Future Development

In the future, I would like to further refine the design as my front-end skills develop.
 Project reordering has been added to the db and models, but needs to be implemented in
 the admin UI. I would also like to implement the ability to filter projects by the technology/stack used.
