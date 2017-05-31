TOKEN='608475628f2fd3c9d16c81aab91b786e'
PROJECT_ID=$1

curl -X GET -H "X-TrackerToken: $TOKEN" "https://www.pivotaltracker.com/services/v5/projects/$PROJECT_ID/epics"
