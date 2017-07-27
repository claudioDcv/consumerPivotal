;(function () {
  var pivotal = new Pivotal;

  function onProjectChange(e) {
    var $loading = $('#loading');
    var $project = $(this);
    var $label = $('#label');
    var $result = $('#result');
    var projectId = $project.val();
    var firstLabel = '<option value="">[ select a label ]</option>';

    $label.html(firstLabel).prop('disabled', true);
    $result.empty();

    if (!projectId) {
        return;
    }

    $loading.toggle(true);
    pivotal
      .getLabels(projectId)
      .then(function(labels) {
        var labelsElements = firstLabel;
        labels.forEach(function (label) {
          labelsElements += '<option value="' + label.name + '" data-id="' + label.id + '">' + label.name + '</option>'
        });
        $label.html(labelsElements).prop('disabled', false);
        $loading.toggle(false);
      });
  }

  function onDailyReportBtnClick(e) {
    var $loading = $('#loading');
    var projectId = $('#project').val();
    var labelName = $('#label').val();

    if (!(projectId && labelName)) {
      return;
    }

    $loading.toggle(true);

    var $result = $('#result');
    var query = 'project_id=' + projectId + '&label=' + labelName;
    var $iframe = $('<iframe src="/reports/daily?' + query + '">');

    $iframe.on('load', function() { $loading.toggle(false); });
    $result.html($iframe);
  }

  function onFormReportSubmit(e) {
    e.preventDefault();
    onDailyReportBtnClick();
  }

  $(function () {
    var $project = $('#project');
    var $label = $('#label');
    var $dailyReportBtn = $('#btn-generate-daily-report');
    var $formReport = $('#form-report');

    $('select').select2();
    $project.on('change', onProjectChange);
    $formReport.on('submit', onFormReportSubmit);
  });
})(jQuery, Pivotal);
