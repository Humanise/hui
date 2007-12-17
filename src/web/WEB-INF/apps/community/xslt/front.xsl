<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:p="http://uri.onlineobjects.com/page/"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
 exclude-result-prefixes="u e p"
>

	<xsl:output encoding="UTF-8" method="xml" indent="yes" doctype-public="-//W3C//DTD XHTML 1.0 Transitional//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"/>
	<!--<xsl:output encoding="UTF-8" indent="yes" method="xml" omit-xml-declaration="yes" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" 
doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>-->

	<xsl:param name="app-context"/>
	<xsl:param name="base-context"/>
	<xsl:param name="user-name"/>

	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="p:page">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<link rel="stylesheet" href="{$app-context}/css/base.css" type="text/css" media="screen" charset="utf-8"/>
				<link rel="stylesheet" href="{$app-context}/css/front.css" type="text/css" media="screen" title="front" charset="utf-8"/>
				<script type="text/javascript" charset="utf-8">
					var info = {
						baseContext:'<xsl:value-of select="$base-context"/>',
						appContext:'<xsl:value-of select="$app-context"/>'
					}
				</script>
				<script type='text/javascript' src='{$base-context}/dwr/interface/CoreSecurity.js'></script>
				<script type='text/javascript' src='{$base-context}/dwr/interface/CommunityTool.js'></script>
  				<script type='text/javascript' src='{$base-context}/dwr/engine.js'></script>
  				<script type='text/javascript' src='{$base-context}/dwr/util.js'></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iScripts.js" type="text/javascript" charset="utf-8"></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iAnimation.js" type="text/javascript" charset="utf-8"></script>
				<script src="{$base-context}/In2iGui/lib/In2iScripts/In2iInput.js" type="text/javascript" charset="utf-8"> </script>
				<script src="{$app-context}/js/Widgets.js" type="text/javascript" charset="utf-8"> </script>
				<script src="{$app-context}/js/front.js" type="text/javascript" charset="utf-8"> </script>
				<title>OnlineObjects</title>
			</head>
			<body>
				<div class="base">
					<div class="header">
						<div class="user">
							Du er logget ind som: <xsl:value-of select="$user-name"/>
						</div>
						<h1>OnlineObjects</h1>
					</div>
					<div class="body">
						<div class="right">
							<h2>Tilmelding</h2>
							<form action="signup" method="get" accept-charset="utf-8" id="signup">
								<div class="response"><xsl:text> </xsl:text></div>
								<label>Brugernavn</label>
								<input type="text" name="username" value="" class="text"/>
								<label>Kodeord</label>
								<input type="password" name="password" value="" class="text"/>
								<label>Navn</label>
								<input type="text" name="name" value="" class="text"/>
								<label>E-post</label>
								<input type="text" name="email" value="" class="text"/>
								<input type="submit" value="Tilmeld" class="submit hidden"/>
							</form>
							<div class="divider"><xsl:comment/></div>
							<h2>Log ind</h2>
							<form action="login" method="get" accept-charset="utf-8" id="login">
								<div class="response"><xsl:text> </xsl:text></div>
								<label>Brugernavn</label>
								<input type="text" name="username" value="" class="text"/>
								<label>Kodeord</label>
								<input type="password" name="password" value="" class="text"/>
								<input type="submit" value="Log ind" class="submit hidden"/>
							</form>
						</div>
						<div class="left">
							<div class="search" style="display: none;">
							<form action="login" method="get" accept-charset="utf-8" id="search">
								<div class="response"><xsl:text> </xsl:text></div>
								<input type="text" name="query" value="" id="search_field" class="text"/>
							</form>
							</div>
							<div class="section">
								<div class="section_head"><h2>Fotografier</h2></div>
								<div class="section_body"><div id="images_container"><xsl:comment/></div></div>
							</div>
						</div>
					</div>
					<div class="footer">
						<xsl:text>Designet og udviklet af In2iSoft</xsl:text>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>