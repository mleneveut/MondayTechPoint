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

            // future notes support
            //var notes = slideElement.querySelector('aside.notes');
            var slideData = {
                indexh : indexh,
                indexv : indexv,
                indexf : fragmentindex,
                nextindexh : nextindexh,
                nextindexv : nextindexv,
                secret: multiplexHttp.secret,
                id : multiplexHttp.id

                // future notes support
                //markdown : notes ? typeof notes.getAttribute('data-markdown') === 'string' : false
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

    Reveal.addEventListener('fragmentshown', fragmentNotify );
    Reveal.addEventListener('fragmenthidden', fragmentNotify );

    var sendSlideChanged = function(slideData){

        var doRequest = function(){
            console.log("Trying request ...");
            var request = $.ajax({ type: 'POST', url: serverUrl + '/master/slidechanged', data: {'slideData': slideData}, dataType: 'json'});
            var presentationPaused = false;
            var requestSuccedeed = null;

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

            request.done(function(data){
                requestSuccedeed = true;
                resumePresentation();
                console.log('Slide changed event sent');
            });

            request.fail(function(jqXHR, textStatus, errorThrown){
                console.log('Failed to send slide change');
                console.log('textStatus ' + textStatus + 'error : ' + errorThrown);
                requestSuccedeed = false;
                Reveal.removeEventListeners();
                pausePresentation();
                /**
                 * TODO : In case of connection failure, save last slide position + try request ?
                 */
                if (requestSuccedeed != null && !requestSuccedeed){
                    console.log("retrying...");
                    doRequest();
                }
            });

        };

        doRequest();
    };

}());