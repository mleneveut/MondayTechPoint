/**
 * Created by flopes on 20/02/14.
 */

(function longPoll(){
    var multiplexHttp = Reveal.getConfig().multiplexHttp;
    var serverUrl = multiplexHttp.url;

    $.ajax({url: serverUrl + '/multiplex-http/currentpos',
        dataType: 'json',
        success: function(data){
            Reveal.slide(parseInt(data.indexh), parseInt(data.indexv), parseInt(data.indexf), 'remote');
            longPoll();
        },  error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
            console.log('error ' + 'textStatus' + textStatus + ' ' + errorThrown);
            console.log('Failed to synchronize with master server');
            longPoll();
        }, timeout: 30000});
}());