TOKEN='yourToken'
PROJECT_ID=$1

curl -X GET -H "X-TrackerToken: $TOKEN" "https://www.pivotaltracker.com/services/v5/projects/$PROJECT_ID/epics"
