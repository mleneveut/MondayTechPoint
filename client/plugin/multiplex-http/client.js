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
            resumePresentation();
            longPoll();
        },  error: function(jqXHR, textStatus, errorThrown){
            console.log(jqXHR);
            console.log('error ' + 'textStatus' + textStatus + ' ' + errorThrown);
            console.log('Failed to synchronize with master server');
            pausePresentation();
            longPoll();
        }, timeout: 30000});

    var pausePresentation = function(){
        if (!presentationPaused){
            $('#modal').modal({
                //fadeDuration: 1000,
                fadeDelay: 0.50,
                escapeClose: false,
                clickClose: false,
                showClose: false
            });
            console.log('Attempting to synchronize master and clients ...');
            presentationPaused = true;
        }
    };

    var resumePresentation = function(){
        $.modal.close();
        Reveal.addEventListeners();
        presentationPaused = false;
    };

}());