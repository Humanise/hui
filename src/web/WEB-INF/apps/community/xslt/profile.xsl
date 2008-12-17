<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
 xmlns="http://www.w3.org/1999/xhtml"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:p="http://uri.onlineobjects.com/page/"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:user="http://uri.onlineobjects.com/model/Item/Entity/User/"
 xmlns:person="http://uri.onlineobjects.com/model/Item/Entity/Person/"
 xmlns:image="http://uri.onlineobjects.com/model/Item/Entity/image/"
 exclude-result-prefixes="e p user person image"
>

	<xsl:output encoding="UTF-8" method="xml" indent="no" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

	<xsl:param name="local-context"/>
	<xsl:param name="base-context"/>
	<xsl:param name="base-domain-context"/>
	<xsl:param name="user-name"/>
	<xsl:param name="development-mode"/>

	<xsl:include href="util.xsl"/>
	
	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template name="scripts">
		<xsl:call-template name="in2igui-js"/>
		<script type="text/javascript" charset="utf-8">
			var OnlineObjects = {
				baseContext:'<xsl:value-of select="$base-context"/>',
				baseDomainContext:'<xsl:value-of select="$base-domain-context"/>',
				appContext:'<xsl:value-of select="$local-context"/>'
			}
		</script>
		<script type='text/javascript' src='{$base-context}/dwr/interface/CoreSecurity.js'><xsl:comment/></script>
		<script type='text/javascript' src='{$base-context}/dwr/interface/AppCommunity.js'><xsl:comment/></script>
		<script type='text/javascript' src='{$base-context}/dwr/engine.js'><xsl:comment/></script>
		<script src="{$local-context}/js/community.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
	</xsl:template>
	
	<xsl:template match="p:page">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<title>OnlineObjects</title>
				<link rel="stylesheet" href="{$local-context}/css/shared.css" type="text/css" media="screen" charset="utf-8"/>
				<link rel="stylesheet" href="{$local-context}/css/profile.css" type="text/css" media="screen" charset="utf-8"/>
				<xsl:comment><![CDATA[[if lt IE 7]>
					<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$local-context"/><![CDATA[/css/front_ie6.css"> </link>
				<![endif]]]></xsl:comment>
				<xsl:call-template name="in2igui-css"/>
			</head>
			<body>
				<div class="root">
					<div class="chrome">
						<xsl:call-template name="chrome-top"/>
						<div class="chrome_middle">
							<div class="chrome_middle">
								<div class="content">
									<div class="content_left">
										<xsl:apply-templates select="p:profile"/>
										<xsl:apply-templates select="p:images"/>
									</div>
								</div>
							</div>
						</div>
						<div class="chrome_bottom">
							<div><div><xsl:comment/></div></div>
						</div>
					</div>
					<div class="body">
					</div>
				</div>
				<div class="footer">
						Designet og udviklet af <a href="http://www.in2isoft.dk/" class="link"><span>In2iSoft</span></a>
   						&#160;·&#160;<a href="http://validator.w3.org/check?uri=referer" class="link"><span>XHTML 1.0 Strict</span></a>
						&#160;·&#160;<a href="http://jigsaw.w3.org/css-validator/validator?uri=http%3A%2F%2Fcommunity.onlineobjects.com%2F&amp;warning=1&amp;profile=css3&amp;usermedium=all" class="link"><span>CSS 2.1</span></a>
   						&#160;·&#160;<a href="iphone/" class="link"><span>iPhone version</span></a>
				</div>
				<xsl:call-template name="scripts"/>
				<xsl:call-template name="analytics"/>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template name="userName">
		<xsl:choose>
			<xsl:when test="string-length(//person:givenName)>0 or string-length(//person:givenName)>0">
				<xsl:value-of select="//person:givenName"/><xsl:text> </xsl:text><xsl:value-of select="//person:familyName"/>
			</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="//user:username"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	
	<xsl:template match="p:profile">
		<div class="profile">
			<div class="profile_image"><xsl:comment/></div>
			<div class="profile_info">
			<h1>
				<xsl:call-template name="userName"/>
			</h1>
			<p><span class="label">Brugernavn: </span><xsl:value-of select="//user:username"/></p>
			<p><a href="http://{//user:username}.{$base-domain-context}/" class="link link_next"><span>Hjemmeside</span></a></p>
			</div>
		</div>
	</xsl:template>
	
	<xsl:template match="p:images">
		<xsl:if test="e:Entity">
		<hr/>
		<div class="images">
			<h2>Billeder</h2>
			<div class="thumbnails"><xsl:comment/>
				<xsl:apply-templates select="e:Entity"/>
			</div>
		</div>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="p:images/e:Entity">
		<div class="thumbnail">
		<a href="{$base-context}/service/image/?id={@id}"><img src="{$base-context}/service/image/id{@id}width60height60cropped.jpg" style="width: 60px; height: 60px;"/></a>
		</div>
	</xsl:template>

</xsl:stylesheet>