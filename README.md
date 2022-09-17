# Hi! I am Darkem

## This is a personal project, made for the management of a MySQL Database with a lite GUI. This project was made using NodeJS, with VueJS and Vue Router. 

### What you need to run this code?
- Docker

### How to run the code

1. Clone the repository
2. Build the image of the Node App on the actual directory with the name "mwc"
    ~~~
    $  docker build -t mwc .
    ~~~
3. Run the image app on Port 3000 and into the "host" network:
    ~~~
    $ docker run -p 3000:3000 --net=host mwc
    ~~~
Now the MySQL Web Client is running on Port 3000, and you can start to manage any MySQL Database you want.
You can create a new table, insert data, delete data, edit data, or make a SQL query, everything using a cute GUI.
