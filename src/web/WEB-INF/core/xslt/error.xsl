<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.w3.org/1999/xhtml"
 	xmlns:p="http://uri.onlineobjects.com/page/"
	exclude-result-prefixes="p"
	>

	<xsl:output encoding="UTF-8" method="xml" omit-xml-declaration="yes" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
	
	<xsl:param name="app-context"/>
	<xsl:param name="base-context"/>
	
	<xsl:template match="p:page">
		<html>
			<head>
				<title><xsl:value-of select="p:error/p:message"/></title>
				<link rel="stylesheet" href="{$base-context}/core/css/error.css" type="text/css" media="screen" title="front" charset="utf-8"/>
			</head>
			<body>
				<div class="body">
				<h1><xsl:value-of select="p:error/p:message"/></h1>
				<textarea><xsl:value-of select="p:error/p:stackTrace"/></textarea>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>