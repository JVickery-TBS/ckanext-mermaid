/**
 * NOTE: Gridstack does not support older browsers,
 *       so we can use more modern ECMA6.
 */
window.addEventListener('load', function(){
  $(document).ready(function() {
    GridStack.renderCB = (_el, _w) => {
      _el.innerHTML = _w.content;
    }

    let addButton;
    const saveField = $('input#mermaid_dashboard');
    const editorWrapper = $('#mermaid-widget-editor-wrapper');
    const editorField = $('#mermaid-widget-editor');
    const iconURI = $(saveField).attr('data-icon-uri');
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      useMaxWidth: true,
    });
    const grid = GridStack.init({
      staticGrid: false,
      column: 12,
      float: false,
      sizeToContent: false,
    });

    $('#mermaid-widget-editor-content').on('hidden.bs.collapse', _event => {
      /**
       * Closes the widget editor when the accordion is collapsed.
       */
      $(editorWrapper).removeClass('mermaid-widget-editor-opened').attr('aria-hidden', 'true');
    });

    if( $(saveField).val() && $(saveField).val().length > 0 ){
      /**
       * Load saved widgets.
       */
      try{
        const saved = JSON.parse($(saveField).val() || '[]');
        saved.forEach(_data => {
          _add_widget(_data.x, _data.y, _data.w, _data.h, _data.content, _data.mermaid);
        });
      }catch(_err){
        console.error('Unable to load Mermaid layout: ', _err);
      }
    }

    function _save_dashboard(){
      /**
       * Saves the grid to a hidden field as a JSON string.
       */
      const layout = grid.getGridItems()
        .filter(_el => _el != addButton)
        .map(_el => {
          const node = _el.gridstackNode;
          return {
            x: node.x,
            y: node.y,
            w: node.w,
            h: node.h,
            content: '',
            mermaid: _el.dataset.mermaid || '',
          };
        });
      $(saveField).val(JSON.stringify(layout));
    }

    function _edit_widget(_widget){
      /**
       * Adds a modal to the page with a textarea
       * to input the Mermaid syntax.
       */
      $(editorField).val(_widget.dataset.mermaid || '');
      $('#mermaid-widget-editor-content').collapse('show');
      $(editorWrapper).addClass('mermaid-widget-editor-opened').attr('aria-hidden', 'false');
      $(editorField).focus();

      const closeButton = $(editorWrapper).find('.accordion-button[data-close-type="exit"]');
      const saveButton = $(editorWrapper).find('.accordion-button[data-close-type="save"]');

      closeButton.off('click.ExitEditor');
      closeButton.on('click.ExitEditor', _event => {
        $(editorField).val('');  // clear the textarea
      });

      saveButton.off('click.SaveEditor');
      saveButton.on('click.SaveEditor', _event => {
        _widget.dataset.mermaid = $(editorField).val();
        $(editorField).val('');  // clear the textarea
        _render_mermaid(_widget);
      });
    }

    function _render_mermaid(_widget){
      /**
       * Renders the Mermaid graphic in the widget.
       */
      const container = _widget.querySelector('.mermaid-grid-diagram-content');
      container.replaceChildren();
      const diagram = document.createElement('div');
      diagram.className = 'mermaid';
      diagram.textContent = _widget.dataset.mermaid || '';
      container.appendChild(diagram);
      mermaid.run({
        nodes: [diagram]
      }).catch(_err => {
        console.error('Unable to render Mermaid diagram: ', _err);
        container.textContent = 'Unable to render diagram. Check the Mermaid syntax.';
      });
    }

    function _add_widget(_x = 0, _y = 0, _w = 12, _h = 2, _content = '', _mermaid = ''){
      /**
       * Adds a widget to the grid.
       */
      if( _mermaid.length == 0 ){
        _content = `<img class="mermaid-grid-diagram-placeholder" src="${iconURI}">`;
      }
      const widget = grid.addWidget({
        x: _x, y: _y,
        w: _w, h: _h,
        content: `
          <div class="mermaid-grid-diagram-container">
            <div class="mermaid-grid-diagram-toolbar">
              <span class="fa fa-pencil edit-widget" tabindex="0" aria-label="Edit Mermaid Diagram" title="Edit Mermaid Diagram"></span>
              <span class="fa fa-trash delete-widget" tabindex="0" aria-label="Delete Mermaid Diagram" title="Delete Mermaid Diagram"></span>
            </div>
            <div class="mermaid-grid-diagram-content">${_content}</div>
          </div>
        `
      });

      if( _mermaid.length > 0 ){
        widget.dataset.mermaid = _mermaid;
        _render_mermaid(widget);
      }

      widget.classList.add('mermaid-grid-diagram-wrapper');
      widget.setAttribute('data-widget-type', 'diagram');
      widget.setAttribute('tabindex', 0);
      widget.querySelector('.delete-widget').addEventListener('click', () => {
        grid.removeWidget(widget);
      });
      widget.querySelector('.delete-widget').addEventListener('keyup', _event => {
        if( _event.keyCode == 13 ){
          grid.removeWidget(widget);
        }
      });
      widget.querySelector('.edit-widget').addEventListener('click', () => {
        _edit_widget(widget);
      });
      widget.querySelector('.edit-widget').addEventListener('keyup', _event => {
        if( _event.keyCode == 13 ){
          _edit_widget(widget);
        }
      });
      return widget;
    }

    function _get_max_y(){
      /**
       * Returns the current max Y postion in the grid,
       * not including the Add Button.
       */
      const items = grid.getGridItems();
      let maxY = 0;
      items.forEach(_item => {
        const node = _item.gridstackNode;
        if( node && node.el !== addButton ){
          maxY = Math.max(maxY, node.y + node.h);
        }
      });
      return maxY;
    }

    function _add_new_widget(){
      /**
       * Add a new widget to a blank or existing grid.
       * NOTE: this needs to be separate due to the Y calculations.
       *       As well as focusing and updating the Add Button position.
       */
      const widget = _add_widget(0, _get_max_y(), 12, 2, '');
      _update_add_button();
      widget.focus();
    }

    function _create_add_button(){
      /**
       * Creates the special Add New Widget button.
       */
      addButton = grid.addWidget({
        x: 0, y: 0,
        w: 12, h: 1,
        noMove: true,
        noResize: true,
        content: `
          <span class="fa fa-plus" aria-label="Add Mermaid Diagram" title="Add Mermaid Diagram"></span>
        `
      });

      addButton.classList.add('mermaid-grid-add-button-wrapper');
      addButton.setAttribute('data-widget-type', 'add-button');
      addButton.setAttribute('tabindex', 0);
      addButton.setAttribute('aria-label', 'Add Mermaid Diagram');
      addButton.setAttribute('title', 'Add Mermaid Diagram');
      addButton.addEventListener('click', _add_new_widget);
      addButton.addEventListener('keyup', _event => {
        if( _event.keyCode == 13 ){
          _add_new_widget();
        }
      });
      _update_add_button();
    }

    function _update_add_button(){
      /**
       * Repositions the Add Button to always
       * be at the bottom of the grid.
       */
      grid.update(addButton, {
        x: 0, y: _get_max_y(),
        w: 12, h: 1
      });
    }

    _create_add_button();  // initialize the Add Button
    $('form.dataset-resource-form').on('submit', _event => {
      _save_dashboard();  // save the gridstack JSON
    });

  });
});
