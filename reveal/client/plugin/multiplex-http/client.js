/**
 * Created by flopes on 20/02/14.
 */

(function longPoll(){
    var multiplexHttp = Reveal.getConfig().multiplexHttp;
    var serverUrl = multiplexHttp.url;

    $.ajax({url: serverUrl + '/client/currentpos',
        dataType: 'json',
        success: function(data){
            console.log(data);
            Reveal.slide(data.indexh, data.indexv, data.indexf, 'remote');
            longPoll();
    },  error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
            console.log(textStatus);
            console.log('error ' + 'textStatus' + ' ' + errorThrown);
            console.log('Failed to synchronize with master server');
            longPoll();
        }, timeout: 30000});

}());