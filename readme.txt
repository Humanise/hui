
================= Environment ================

export JAVA_HOME=$(/usr/libexec/java_home)

# Maven encoding
export JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF8"

export MAVEN_OPTS="-XX:MaxPermSize=512m"


================= Maven ============== 

Installing local jar

mvn install:install-file -Dfile=/Users/jonasmunk/Downloads/XOM/xom-1.2.10.jar -Dsources=/Users/jonasmunk/Downloads/XOM/xom-1.2.10.sources.jar -DgroupId=nu.xom -DartifactId=xom -Dversion=1.2.10 -Dpackaging=jar -DlocalRepositoryPath=repository

================= Grunt ============== 

sudo npm install

sudo gem install compass -n /usr/local/bin

=========== Tomcat / Apache setup ============

Make httpd pass the encoded slashes on to tomcat
<VirtualHost *>
  ... bla bla ...
  AllowEncodedSlashes NoDecode
</VirtualHost>

Add to {tomcat}conf/catalina.properties:
org.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH=true

... or add as a VM argument in Eclipse:
-Dorg.apache.tomcat.util.buf.UDecoder.ALLOW_ENCODED_SLASH=true

In {tomcat}conf/server.xml

The connector should have URIEncoding="UTF-8":
<!-- Define an AJP 1.3 Connector on port 8009 -->
<Connector port="8009" protocol="AJP/1.3" redirectPort="8443" URIEncoding="UTF-8"/>