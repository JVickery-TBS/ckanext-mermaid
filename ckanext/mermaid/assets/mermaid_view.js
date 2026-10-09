/**
 * NOTE: Gridstack does not support older browsers,
 *       so we can use more modern ECMA6.
 */
window.addEventListener('load', function(){
  $(document).ready(function() {
      const data = MERMAID_DASHBOARD_DATA;
      const grid = GridStack.init({
        staticGrid: true,
        column: 12,
        float: false,
        cellHeight: 'auto',
        sizeToContent: true,
      });
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        useMaxWidth: true,
      });

      data.forEach(_data => {
        const widget = grid.addWidget({
          x: _data.x,
          y: _data.y,
          w: _data.w,
          h: _data.h,
          noMove: true,
          noResize: true
        });

        const container = widget.querySelector('.grid-stack-item-content');
        const diagram = document.createElement('div');
        diagram.className = 'mermaid';
        diagram.textContent = _data.mermaid || '';
        container.appendChild(diagram);
        mermaid.run({
          nodes: [diagram]
        }).catch(_err => {
          console.error('Unable to render Mermaid diagram: ', _err);
          container.textContent = '';  // hide front-end error
        });
      });
  });
});
