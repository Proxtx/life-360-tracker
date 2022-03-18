# life-360-tracker

Saves the location of your life360 circle to JSON-Files. You can set a custom interval when a new file should be created to prevent large files. This repo will generate two folders: 

1. data
2. locations

data: This will store all possible data the programm can gather. This includes battery, address, email, phonenumber and more.
locations: This will store just the location and if possible its name: [...]s Home, School, Work etc

# How to use

1. git clone https://github.com/Proxtx/life-360-tracker
2. go into the folder
3. npm i
4. copy config.example.json -> config.json
5. Replace email and password with you life360 login credentials
6. adjust fullDataInterval, locationInterval, fileChangeInterval (in ms)
7. run node .

Your files will appear in data and locations
