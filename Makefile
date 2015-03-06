test:
	mvn test -q

run:
	mvn jetty:run -DskipTests=true
	
