this.ckan.module('mermaid-viewer', function($){
  return {
    /* options object can be extended using data-module-* attributes */
    options : {
      config: {},
    },
    initialize: function (){
      let viewContainer = $('#mermaid-container');

      console.log('Successfully rendered Mermaid Markdown...');

    }
  };
});
