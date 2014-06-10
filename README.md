MondayTechPoint
===============

Présentation technique ou autre du Lundi

## Structure
- client : nothing to change, this is where the master project will be copied, and modified, at deployment
- master : this is where you create your presentation

## Installation

#####Clone project : 
```sh
$ git clone https://github.com/mleneveut/MondayTechPoint.git
```

#####In the repository, create your own branch, and switch to it :
```sh
$ git checkout -b "[presentation_name]"
```
#####Retrieve dependencies : 
```sh
$ npm install
```
#####Create your slides / themes

#####Configure multiplex (master/js/reveal-config.js + master/js/reveal-config-client.js)


##Deploy project

This script will copy your master project into */client* and rename *reveal-config-client.js* to *reveal-config.js*

*Ensure your "deploy.sh" file is executable*

```sh
$ npm run-script production
```


##Run your project
```sh
$ npm start
```

#####Go to

- [http://localhost/master/](http://localhost/master/ Master presentation) to control the presentation

- [http://localhost/client/](http://localhost/client/ Client presentation) to see the presentation


## Multiplex-http plugin
![Multiplex-http plugin architecture](reveal/master/img/reveal-multiplex-http-diagram.png)



www.ippon.fr
