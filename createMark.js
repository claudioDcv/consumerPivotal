const STYLE = require('./style.js').getStyle();

const createMark = function t(storyOut, epicsOut, QUERYLABEL) {
	const htmlStart = `
	<!DOCTYPE html>
	<html lang="es">
		<head>
			<meta charset="utf-8">
			<title>Reporte Diario - label: ${QUERYLABEL}</title>
			<style>${STYLE}</style>
		</head>
		<body>
	`;

	const htmlEnd = `
	</body>
	</html>
	`;
    var mapState = {
        'finished': 'btn btn-success btn-sm btn-tag',
        'accepted' : 'btn btn-success btn-sm btn-tag',
        'delivered': 'btn btn-warning btn-sm btn-tag',
        'unstarted': 'btn btn-default btn-sm btn-tag',
        'unscheduled': 'btn btn-unscheduled btn-sm btn-tag',
        'started': 'btn btn-primary btn-sm btn-tag',
    };
    var epics = JSON.parse(epicsOut)
    var storys = JSON.parse(storyOut)
    var epicsClean = {};
    for (var i = 0; i < epics.length; i++) {
        epicsClean[epics[i].label.name] = {
            name: epics[i].name,
            url: epics[i].url,
            id: epics[i].id,
            storys: [],
        }
    }
    // console.log(epicsClean);

    for (var i = 0; i < storys.length; i++) {
        var sto = storys[i];
        for (var j = 0; j < sto.labels.length; j++) {
            var lbls = sto.labels[j];
            var epic = epicsClean[lbls.name];
            if (epic) {
                // console.log(epic);
                epic.storys.push(sto);
            }
        }
    }

    // console.log(epicsClean);

    //MD
    var out = '\n### AYER\n\n### HOY\n';
    var htmlOut = '';
    for (var v in epicsClean) {
        if (epicsClean.hasOwnProperty(v)) {
            var ec = epicsClean[v];
            if (ec.storys.length > 0) {

                var mdStorys = '';
                var htmlStorys = '';

                var point = 0;
                // console.log(ec.storys);
                for (var j = 0; j < ec.storys.length; j++) {
                    // epicsClean[i].storys[j]
                    var story = ec.storys[j];
                    // console.log(story.estimate);
                    var pnt = story.estimate || 0;
                    point += pnt;

                    // mdStorys += `* ${story.name} [#${story.id}](${story.url}) - ${story.current_state} / ${story.estimate || 'No Estimado'} Puntos | Tipo \`${story.kind}\`\n`;

                    mdStorys += `- ${story.name} [#${story.id}](${story.url})\n`;

                    htmlStorys += `<li><span class="${mapState[story.current_state]}">${story.current_state}</span> <strong>${story.name}</strong> <a href="${story.url}" target="_blank">[#${story.id}]</a> / ${story.estimate || '<span class="bg-danger">No Estimado</span>'} Puntos\n | Tipo ${story.kind}</li>`;
                }

                out += `EPIC - ${ec.name}: ${point} Puntos \n` + `${mdStorys}\n`;
                htmlOut += `<h4>${ec.name} <small>${point} Puntos</small></h4>\n<ul>` + htmlStorys + '</ul><hr/>\n';
            }

        }
    }

    const styleCSS = `
    style="    width: 100%;
    border: solid 1px #adadad;
    border-radius: 5px;
    padding: 5px;
    "`;
    return htmlStart + `<div class="container"><div class="row"><div class="col-md-12"><h3>Reporte Diario <small>label: ${QUERYLABEL}</small></h3><br/>` + htmlOut + `<textarea class"form-control" ${styleCSS}>${out}</textarea></div></div></div>` + htmlEnd;
}

exports.createMark =  createMark;
