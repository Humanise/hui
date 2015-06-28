test:
	mvn test -q

run:
	mvn jetty:run -DskipTests=true

tomcat:
	mvn clean install -DskipTests=true
	/Users/jbm/Code/apache-tomcat-8.0.20/bin/startup.sh

install:
	mvn clean install -DskipTests=true

deploy:
	cd /Users/jbm/Udvikling/Workspace/onlineobjects/src/main/webapp/hui/tools/
	/Users/jbm/Udvikling/Workspace/onlineobjects/src/main/webapp/hui/tools/compile.sh
	cd /Users/jbm/Udvikling/Workspace/onlineobjects/
	mvn clean install -DskipTests=true
	ant deploy
	rsync -r -a -v -e "ssh -l root" --delete /Users/jbm/Midlertidigt/OnlineObjects/onlineobjects 87.230.95.85:/root/sync
	
	ssh root@87.230.95.85 "make deploy"
