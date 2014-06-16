
+function ($) { 'use strict';

  // Markdown Parser Settings
  var parser = {
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: false,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false
    };

  // Data Updater: updates target content with new data
  // @data.target: html selector
  // @data.content: data from ace-editors
  function dataUpdater (data) {
    $(data.target).html(marked(data.content));
    $('.output-preview pre > code').addClass('prettyprint linenums');
  }

  // Initialize Multiple Ace Editors
  function acEditor (data) {
    var editor  = ace.edit(data.id),
        session = editor.getSession();


    // Set Editor themes for Markdown Syntax docs.
    editor.setTheme('ace/theme/' + data.theme);
    editor.getSession().setMode('ace/mode/' + data.mode);

    // Initialize Session Defaults
    session.setUseSoftTabs(true);
    session.setTabSize(2);
    session.setUndoManager(new ace.UndoManager());

    // Update target contents with new updated
    // data from the editor.
    editor
      .getSession()
      .on('change', function () {
        dataUpdater({
          target: $(editor.container).data('target'),
          content: editor.session.getValue()
        })
      });

    // Initial content for Syntax docs.
    dataUpdater({
      target: $(editor.container).data('target'),
      content: editor.session.getValue()
    });
  }

  // Initialize Markdown Parser
  marked.setOptions(parser);

  // Main Event
  acEditor({
    id: 'editor',
    mode: 'markdown',
    theme: 'monokai'
  });

  // Prettify the code
  window.prettyPrint && prettyPrint();

}(window.jQuery);