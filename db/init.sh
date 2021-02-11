psql postgres -c "CREATE ROLE badges_user WITH LOGIN CREATEDB PASSWORD '${BADGES_PASSWORD}';"
psql postgres -c "CREATE DATABASE badges OWNER badges_user;"

psql postgres -c "CREATE ROLE accounts_user WITH LOGIN CREATEDB PASSWORD '${ACCOUNTS_PASSWORD}';"
psql postgres -c "CREATE DATABASE accounts OWNER accounts_user;"

psql postgres -c "CREATE ROLE presentations_user WITH LOGIN CREATEDB PASSWORD '${PRESENTATIONS_PASSWORD}';"
psql postgres -c "CREATE DATABASE presentations OWNER presentations_user;"

psql postgres -c "CREATE ROLE events_user WITH LOGIN CREATEDB PASSWORD '${EVENTS_PASSWORD}';"
psql postgres -c "CREATE DATABASE events OWNER events_user;"
