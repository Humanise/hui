<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:p="http://uri.onlineobjects.com/page/"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:ps="http://uri.onlineobjects.com/model/Item/Entity/Person/"
 xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
 xmlns:ea="http://uri.onlineobjects.com/model/Item/Entity/EmailAddress/"
 exclude-result-prefixes="u e p ps ea"
>

	<xsl:output encoding="UTF-8" method="xml" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN"/>


	<xsl:param name="local-context"/>
	<xsl:param name="base-context"/>

	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="p:page">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<link rel="stylesheet" href="{$local-context}/css/base.css" type="text/css" media="screen" charset="utf-8"/>
				<link rel="stylesheet" href="{$local-context}/css/front.css" type="text/css" media="screen" title="front" charset="utf-8"/>
				<link rel="stylesheet" href="{$local-context}/css/invitation.css" type="text/css" media="screen" title="front" charset="utf-8"/>
				<xsl:comment><![CDATA[[if lt IE 7]>
					<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$local-context"/><![CDATA[/css/invitation_ie6.css"> </link>
				<![endif]]]></xsl:comment>
				<link rel="stylesheet" href="{$base-context}/In2iGui/css/alert.css" type="text/css" media="screen" title="front" charset="utf-8"/>
				<script type="text/javascript" charset="utf-8">
					var OnlineObjects = {
						baseContext:'<xsl:value-of select="$base-context"/>',
						appContext:'<xsl:value-of select="$local-context"/>'
					}
				</script>
				<script type='text/javascript' src='{$base-context}/dwr/interface/CoreSecurity.js'><xsl:comment/></script>
				<script type='text/javascript' src='{$base-context}/dwr/interface/AppCommunity.js'><xsl:comment/></script>
  				<script type='text/javascript' src='{$base-context}/dwr/engine.js'><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/lib/prototype.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iScripts.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iAnimation.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iInput.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/In2iGui.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Alert.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/Button.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$local-context}/js/Widgets.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$local-context}/js/invitation.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<title>OnlineObjects invitation</title>
			</head>
			<body>
				<xsl:apply-templates/>
			</body>
		</html>
	</xsl:template>
	
	<xsl:template match="p:invitation">
		<div class="base">
		<h1>Invitation til OnlineObjects</h1>
		<p>Hej <xsl:value-of select="p:invited/e:Entity[@type='Item/Entity/Person']/e:name"/>.</p>
		<p><a href="{$local-context}/{p:inviter/e:Entity/u:User/u:username}/site/"><xsl:value-of select="p:inviter/e:Entity[@type='Item/Entity/Person']/e:name"/><xsl:comment/></a> har inviteret dig til at blive bruger af OnlineObjects. Systemet kan anvendes til at lave hjemmesider og dele information.</p>
		<p><xsl:value-of select="p:inviter/e:Entity/ps:Person/ps:givenName"/> har følgende besked til Dem...</p>
		<blockquote>"<xsl:value-of select="p:message"/>"</blockquote>
		<p>Bliv bruger med det samme ved at udfylde følgende...</p>
		<form id="formula">
			<input type="hidden" name="code" value="{p:code}"/>
			<label>Brugernavn <span id="username_error"><xsl:comment/></span></label>
			<input name="username" type="text" class="text" value=""/>
			<label>Kodeord <span id="password1_error"><xsl:comment/></span></label>
			<input name="password1" type="password" class="password" value=""/>
			<label>Kodeord igen <span id="password2_error"><xsl:comment/></span></label>
			<input name="password2" type="password" class="password" value=""/>
			<input type="submit" class="submit" value="Tilmeld"/>
		</form>
		</div>
	</xsl:template>
	
	<xsl:template match="p:error[@key='accepted']">
		<div class="base">
		<h1>Invitation til OnlineObjects</h1>
		<p>Denne invitation er allerede blevet accepteret. <a href="http://www.in2isoft.dk/kontakt/">Kontakt os venligst</a> hvis du mener det er en fejl.</p>
		</div>
	</xsl:template>
	
	<xsl:template match="p:error[@key='notfound']">
		<div class="base">
		<h1>Invitation ikke fundet</h1>
		<p>Det var desværre ikke muligt at finde invitationen. Den er muligvis blevet fjernet efter den er blevet afsendt. <a href="http://www.in2isoft.dk/kontakt/">Kontakt os venligst</a> hvis du mener det er en fejl.</p>
		</div>
	</xsl:template>
	
	<xsl:template match="p:error">
		<div class="base">
		<h1>Invitation ikke fundet</h1>
		<p>Det var desværre ikke muligt at finde invitationen. <a href="http://www.in2isoft.dk/kontakt/">Kontakt os venligst</a> hvis du mener det er en fejl.</p>
		</div>
	</xsl:template>
</xsl:stylesheet>