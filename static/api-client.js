;(function ($, global) {
  function Pivotal () {
    var _this = this;

    _this.base_url = '/api';
  }

  (function () {
    this.getLabels = function (project_id) {
      var _this = this;
      return $.ajax({
        url: _this.base_url + '/projects/' + project_id + '/labels',
      });
    };
  }).apply(Pivotal.prototype);

  global.Pivotal = Pivotal;
})(jQuery, window);
