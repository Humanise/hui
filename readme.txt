Updating dependencies...
ant -f ivy.build.xml


Environment...

export JAVA_HOME=$(/usr/libexec/java_home)

# Maven encoding
export JAVA_TOOL_OPTIONS="-Dfile.encoding=UTF8"

export MAVEN_OPTS="-XX:MaxPermSize=512m"