/**
 * Created by flopes on 20/02/14.
 */

(function() {
    // Don't emit events from inside of notes windows
    if ( window.location.search.match( /receiver/gi ) ) { return; }

    var multiplexHttp = Reveal.getConfig().multiplexHttp;
    var serverUrl = multiplexHttp.url;

    var notify = function( slideElement, indexh, indexv, origin ) {
        if( typeof origin === 'undefined' && origin !== 'remote' ) {
            var nextindexh;
            var nextindexv;

            var fragmentindex = Reveal.getIndices().f;
            if (typeof fragmentindex == 'undefined') {
                fragmentindex = 0;
            }

            if (slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
                nextindexh = indexh;
                nextindexv = indexv + 1;
            } else {
                nextindexh = indexh + 1;
                nextindexv = 0;
            }

            var slideData = {
                indexh : indexh,
                indexv : indexv,
                indexf : fragmentindex,
                nextindexh : nextindexh,
                nextindexv : nextindexv,
                secret: multiplex.secret,
                id : multiplex.id
            };

            sendSlideChanged(slideData);
        }
    }

    Reveal.addEventListener('slidechanged', function( event ) {
        notify( event.currentSlide, event.indexh, event.indexv, event.origin );
    });

    var fragmentNotify = function( event ) {
        notify( Reveal.getCurrentSlide(), Reveal.getIndices().h, Reveal.getIndices().v, event.origin );
    };

    var sendSlideChanged = function(slideData){
        console.log("SENDING slide changed");
        $.ajax({ url: serverUrl + '/currentpos', data: slideData , success: function(data){
            console.log('slideChanged Event sent');
        }, dataType: 'json', complete: poll, timeout: 30000 });
    };

    Reveal.addEventListener('fragmentshown', fragmentNotify );
    Reveal.addEventListener('fragmenthidden', fragmentNotify );
}());