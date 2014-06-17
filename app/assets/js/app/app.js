
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

  // Zip Generator
  var zip = new JSZip();




  // Data Updater: updates target content with new data
  // @data.target: html selector
  // @data.content: data from ace-editors
  function dataUpdater (data) {
    $(data.target).html(marked(data.content));

    if (data.prettify) {
      $('.output-preview pre > code')
        .addClass('prettyprint linenums');
    }

    if (data.generator) {
      $('[data-toggle=export]').on('click', function (e) {
        var dataType = $(this).data('type'),
            fileName = $('#filename').val();

        function createFile (data) {
          // Create file and add contents
          zip.file(data.file_name, data.file_content);

          var content = zip.generate({ type: 'blob' });

          // Save Data as Zip now
          saveAs(content, fileName + '.zip');
        }

        if (!fileName) {
          alert('You should have a filename');
        } else {
          switch (dataType) {

            case 'markdown':
              createFile({
                file_name: fileName + '.md',
                file_content: data.content,
                callback: function (content) {
                  saveAs(content, fileName + '.zip');
                }
              });
            break;

            case 'html':
              createFile({
                file_name: fileName + '.html',
                file_content: marked(data.content)
              });
            break;

          }
        }

        e.preventDefault()
      });
    }
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

    // Initial content docs.
    dataUpdater({
      target: $(editor.container).data('target'),
      content: editor.session.getValue(),
      prettify: true,
      generator: true
    });
  }

  // Initialize Markdown Parser
  marked.setOptions(parser);

  // Main Event
  acEditor({
    id: 'editor',
    mode: 'markdown',
    theme: 'monokai',
    prettify: true,
    generator: true
  });

  // Prettify the code
  window.prettyPrint && prettyPrint();

}(window.jQuery);