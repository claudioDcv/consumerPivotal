# Pivotal Report

## Installation

```sh
# Clone repository
git clone <url-this-project>
# Install dependencies
yarn install
# Create .env files and added your Pivotal TOKEN
cp .env.example .env
# Run application with Node Foreman
nf start
```
## Usage

```sh
curl http://localhost:8899/?project_id={PROJECT_ID}&label={LABEL}
```
