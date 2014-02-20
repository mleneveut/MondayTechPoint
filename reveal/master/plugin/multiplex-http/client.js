/**
 * Created by flopes on 20/02/14.
 */

(function(){
    var multiplexHttp = Reveal.getConfig().multiplexHttp;
    var serverUrl = multiplexHttp.url;

    $.ajax({ url: serverUrl + '/currentpos' , type: 'post', success: function(data){
        Reveal.slide(data.indexh, data.indexv, data.indexf, 'remote');
    }, dataType: 'json', complete: poll, timeout: 30000 });

}());