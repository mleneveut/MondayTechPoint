/**
 * Created by flopes on 04/03/14.
 */

var childProcess = require('child_process');

childProcess.exec('deploy.sh ', function(error, stdout, stderr){
    var success = false;
    var logs;
    if (error == ''){
        success = true;
        logs = stdout;
    }else{
        logs = error;
    }
    console.log('LOGS : \n ' + logs);
    console.log(error);
    console.log(stderr);
});
