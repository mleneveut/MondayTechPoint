MondayTechPoint
===============

Présentation technique ou autre du Lundi

## Structure
- client : nothing to change, this is where the master project will be copied, and modified, at deployment
- master : presentation, this is where you can work

## Installation

#####Clone project : 
```sh
$ git clone https://github.com/mleneveut/MondayTechPoint.git
```

#####In the repository, create your own branch, and switch to it :
```sh
$ git checkout -b "[presentation_name]"
```
#####Run : 
```sh
$ npm install
```
#####Create your slides / themes

#####Configure multiplex (master/js/reveal-config.js + master/js/reveal-config-client.js)

#####Commit and push the modifications on the new branch :

```sh
$ git commit -am "Created my presentation..."
```
```sh
$ git push origin "[presentation_name]"
```



www.ippon.fr
