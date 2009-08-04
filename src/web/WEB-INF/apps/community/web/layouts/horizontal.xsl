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
				<link rel="stylesheet" id="pageDesign" href="{$local-context}/designs/{$page-design}/css/style.css?{$cache-version}" type="text/css" media="screen" title="front" charset="utf-8"><xsl:comment/></link>
			</head>
			<body>
				<div class="body">
					<div class="gut"><div class="gut"><div class="gut">
					<div class="inner_body toolbar_padder">
						<!--
						<a href="http://{$base-domain-context}/" class="back">Tilbage</a>
						-->
						<div class="header">
							<ol class="navigation">
							<xsl:for-each select="p:context/p:nodes/e:Entity[@type='Item/Entity/WebNode']">
								<li>
								<a href="?id={@id}" id="node-{@id}">
									<xsl:attribute name="class">
										<xsl:text>webnode</xsl:text>
										<xsl:if test="@id=//p:context/e:Entity[@type='Item/Entity/WebNode']/@id">
											<xsl:text> selected</xsl:text>
										</xsl:if>
									</xsl:attribute>
									<xsl:value-of select="e:name"/>
								</a>
								</li>
							</xsl:for-each>
							</ol>
						</div>
						<div class="content">
							<div class="content_artifact1"><xsl:comment/></div>
							<div class="content_artifact2"><xsl:comment/></div>
							<div class="content_artifact3"><xsl:comment/></div>
							<div class="content_artifact4"><xsl:comment/></div>
							<div class="content_top"><xsl:comment/></div>
							<div class="content_middle">
								<div class="content_body">
									<xsl:apply-templates select="p:content"/>
								</div>
							</div>
							<div class="content_bottom"><xsl:comment/></div>
						</div>
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