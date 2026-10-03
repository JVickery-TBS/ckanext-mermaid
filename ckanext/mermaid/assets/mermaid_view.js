this.ckan.module('mermaid-viewer', function($){
  return {
    /* options object can be extended using data-module-* attributes */
    options : {
      config: {},
    },
    initialize: function (){
      let moduleElement = this.el;
      let viewContainer = $(moduleElement).find('.mermaid-container');

      const maxTries = 35;
      let interval = false;
      let tries = 0;

      interval = setInterval(function(){
        const MERMAID = $(viewContainer).children('.mermaid');
        const hasSVG = typeof $(MERMAID).find('svg') != 'undefined' && $(MERMAID).find('svg').length > 0;
        if( tries > maxTries ){
          clearInterval(interval);
          interval = false;
          return;
        }
        if( $(MERMAID).attr('data-processed') == 'true' && hasSVG ){
          clearInterval(interval);
          interval = false;
          $(MERMAID).addClass('mermaid-show');
          $(MERMAID).attr('aria-hidden', 'false');
          return;
        }
        tries++;
      }, 150);
    }
  };
});
