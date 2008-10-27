<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
 xmlns="http://www.w3.org/1999/xhtml"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
 xmlns:p="http://uri.onlineobjects.com/publishing/WebPage/"
 exclude-result-prefixes="e u p"
>	
	<xsl:template match="/">
		<xsl:apply-templates select="p:WebPage"/>
	</xsl:template>
	
	<xsl:template match="p:WebPage">
		<html>
			<head>
				<xsl:call-template name="p:head"/>
				<link rel="stylesheet" id="pageDesign" href="{$local-context}/designs/{$page-design}/css/style.css" type="text/css" media="screen" title="front" charset="utf-8"/>
			</head>
			<body>
				<div class="body">
					<div class="gut"><div class="gut"><div class="gut">
					<div class="inner_body toolbar_padder">
						<a href="{$local-context}/" class="back">Tilbage</a>
						<div class="header">
							<xsl:for-each select="p:context/p:nodes/e:Entity[@type='Item/Entity/WebNode']">
								<xsl:if test="position()>1"> · </xsl:if>
								<a href="?id={@id}" id="item-{@id}">
									<xsl:attribute name="class">
										webnode
										<xsl:if test="@id=//p:context/e:Entity[@type='Item/Entity/WebNode']/@id">
											selected
										</xsl:if>
									</xsl:attribute>
									<xsl:value-of select="e:name"/>
								</a>
							</xsl:for-each>
						</div>
						<xsl:apply-templates select="p:content"/>
					</div>
					</div></div></div>
				</div>
				<div class="footer"><xsl:comment/></div>
				<xsl:call-template name="p:analytics"/>
			</body>
		</html>
	</xsl:template>

	<xsl:template match="p:content">
		<xsl:apply-templates/>
	</xsl:template>
	
</xsl:stylesheet>