exports.groupStoriesInEpics = function (epics, stories) {
  processEpics = {};
  epics.forEach(function (epic) {
    processEpics[epic.label.name] = {
      name: epic.name,
      url: epic.url,
      id: epic.id,
      stories: [],
      points: 0,
    };
  });

  stories.forEach(function (story) {
    story.labels.forEach(function (label) {
      if (label.name in processEpics) {
        processEpics[label.name].stories.push(story);
        processEpics[label.name].points += story.estimate || 0;
      }
    });
  });

  return Object.keys(processEpics).map(function (i) {
    return processEpics[i];
  });
}

exports.makeDailyReportMarkdown = function (epics) {
  output = '';
  epics.forEach(function (epic) {
    if (epic.stories.length > 0) {
      temp = '';
      epic.stories.forEach(function (story) {
        temp += `- ${story.name} \\[[#${story.id}](${story.url})\\]\n`;
      });

      output += `EPIC - ${epic.name}: ${epic.points} pts.\n\n${temp}\n\n`;
    }
  });

  return output;
}
