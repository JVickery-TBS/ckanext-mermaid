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

    let i = 0;
    data.forEach(_data => {
      const widget = grid.addWidget({
        x: _data.x,
        y: _data.y,
        w: _data.w,
        h: _data.h,
        id: `mermaid-widget-${i}`,
        noMove: true,
        noResize: true,
        sizeToContent: false,
      });
      i++;

      const widgetContent = widget.querySelector('.grid-stack-item-content');
      const container = document.createElement('div');
      container.className = 'mermaid-container';
      const diagram = document.createElement('div');
      diagram.className = 'mermaid';
      diagram.textContent = _data.mermaid || '';
      container.appendChild(diagram)
      widgetContent.appendChild(container);
      if( _data.mermaid.length == 0 ){
        return true;  // no syntax to render, continue
      }
      mermaid.run({
        nodes: [diagram]
      }).then(() => {
        widgetContent.querySelectorAll('.mermaid-container').forEach(_container => {
          // TODO: zooming and panning??
        });
      }).catch(_err => {
        console.error('Unable to render Mermaid diagram: ', _err);
        container.textContent = '';  // hide front-end error
      });
    });
  });
});
