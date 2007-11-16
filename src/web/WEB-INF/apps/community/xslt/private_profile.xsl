<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:p="http://uri.onlineobjects.com/page/"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
>

	<xsl:output encoding="UTF-8" indent="yes" method="html" omit-xml-declaration="yes" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN" 
doctype-system="http://www.w3.org/TR/html4/loose.dtd"/>

	<xsl:template match="/">
		<xsl:apply-templates/>
	</xsl:template>
	
	<xsl:template match="p:page">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<link rel="stylesheet" href="css/base.css" type="text/css" media="screen" charset="utf-8"/>
				<link rel="stylesheet" href="css/front.css" type="text/css" media="screen" title="front" charset="utf-8"/>
				<script type='text/javascript' src='../../dwr/interface/CoreSecurity.js'></script>
				<script type='text/javascript' src='../../dwr/interface/CommunityTool.js'></script>
  				<script type='text/javascript' src='../../dwr/engine.js'></script>
  				<script type='text/javascript' src='../../dwr/util.js'></script>
				<script src="../../XmlWebGui/Scripts/In2iScripts.js" type="text/javascript" charset="utf-8"></script>
				<script src="../../XmlWebGui/Scripts/In2iScripts/In2iAnimation.js" type="text/javascript" charset="utf-8"></script>
				<script src="js/In2iInput.js" type="text/javascript" charset="utf-8"> </script>
				<script src="js/Widgets.js" type="text/javascript" charset="utf-8"> </script>
				<script src="js/front.js" type="text/javascript" charset="utf-8"> </script>
				<title>NetPlace</title>
			</head>
			<body>vzvvxcc
				<div class="base">
					<div class="right">
						<div class="light_box signup">
						<div class="top"><div><div><xsl:comment/></div></div></div>
						<div class="middle">
							<h2>Tilmelding</h2>
							<form action="signup" method="get" accept-charset="utf-8" id="signup">
								<div class="response"><xsl:text> </xsl:text></div>
								<div class="half_left">
									<label>Brugernavn:</label>
									<input type="text" name="username" value="" class="text"/>
								</div>
								<div class="half_right">
									<label>Kodeord:</label>
									<input type="password" name="password" value="" class="text"/>
								</div>
								<input type="submit" value="Tilmeld" class="submit hidden"/>
							</form>
						</div>
						<div class="bottom"><div><div><xsl:comment/></div></div></div>
						</div>
						<div class="light_box login">
						<div class="top"><div><div><xsl:comment/></div></div></div>
						<div class="middle">
							<h2>Log ind</h2>
							<form action="login" method="get" accept-charset="utf-8" id="login">
								<div class="response"><xsl:text> </xsl:text></div>
								<div class="half_left">
									<label>Brugernavn:</label>
									<input type="text" name="username" value="" class="text"/>
								</div>
								<div class="half_right">
									<label>Kodeord:</label>
									<input type="password" name="password" value="" class="text"/>
								</div>
								<input type="submit" value="Log ind" class="submit hidden"/>
							</form>
						</div>
						<div class="bottom"><div><div><xsl:comment/></div></div></div>
						</div>
						
					</div>
					<div class="left">
						<div id="poster"><xsl:comment/></div>
						<div class="search">
						<form action="login" method="get" accept-charset="utf-8" id="search">
							<div class="response"><xsl:text> </xsl:text></div>
							<input type="text" name="query" value="" id="search_field" class="text"/>
						</form>
						</div>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>