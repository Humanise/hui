<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:p="http://uri.onlineobjects.com/page/"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
 exclude-result-prefixes="u e p"
>

	<xsl:output encoding="UTF-8" method="xml" indent="no" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

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
				<xsl:comment><![CDATA[[if lt IE 7]>
					<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$app-context"/><![CDATA[/css/front_ie6.css"> </link>
				<![endif]]]></xsl:comment>
				<link rel="stylesheet" href="{$base-context}/In2iGui/css/minimized.css" type="text/css" media="screen" title="front" charset="utf-8"/>
				<script type="text/javascript" charset="utf-8">
					var OnlineObjects = {
						baseContext:'<xsl:value-of select="$base-context"/>',
						appContext:'<xsl:value-of select="$app-context"/>'
					}
				</script>
				<script type='text/javascript' src='{$base-context}/dwr/interface/CoreSecurity.js'><xsl:comment/></script>
				<script type='text/javascript' src='{$base-context}/dwr/interface/CommunityTool.js'><xsl:comment/></script>
  				<script type='text/javascript' src='{$base-context}/dwr/engine.js'><xsl:comment/></script>
				<script src="{$base-context}/In2iGui/js/minimized.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<script src="{$app-context}/js/front.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
				<title>OnlineObjects</title>
			</head>
			<body>
				<div class="base">
					<div class="head">
						<div class="clouds">
							<h1>OnlineObjects</h1>
							<div class="search">
								<div class="inner_search">
									<form action="#" method="get" accept-charset="utf-8" id="search">
										<div><input type="text" name="query" value="" id="search_field" class="text"/></div>
									</form>
								</div>
							</div>
						</div>
					</div>
					<div class="user">
						Du er logget ind som: <xsl:value-of select="$user-name"/>
					</div>
					<div class="body">
						<div class="right">
							<!--
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
							-->
							<h2>Log ind</h2>
							<form action="login" method="get" accept-charset="utf-8" id="login">
								<div>
								<div class="response"><xsl:text> </xsl:text></div>
								<label>Brugernavn</label>
								<input type="text" name="username" value="" class="text"/>
								<label>Adgangskode</label>
								<input type="password" name="password" value="" class="text"/>
								<input type="submit" value="Log ind" class="submit hidden"/>
								</div>
							</form>
						</div>
						<div class="left">
							<div class="section">
								<div class="section_head"><h2>Fotografier</h2></div>
								<div class="section_body"><div id="images_container"><xsl:comment/></div></div>
							</div>
							<div class="section">
								<div class="section_head"><h2>Brugere</h2></div>
								<div class="section_body"><div id="users_container"><xsl:comment/></div></div>
							</div>
							<div class="section">
								<div class="section_head"><h2>Nøgleord</h2></div>
								<div id="tags_container" class="cloud">
								<a href="#" class="tag tag-1"><span>Ski</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-5"><span>Sne</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-3"><span>Ferie</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-4"><span>Solskin</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-1"><span>St. Anton</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-5"><span>Østrig</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-2"><span>Hop</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-3"><span>Buster Munk</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-1"><span>Ski</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-5"><span>Sne</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-3"><span>Ferie</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-4"><span>Solskin</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-1"><span>St. Anton</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-5"><span>Østrig</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-2"><span>Hop</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-3"><span>Buster Munk</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-1"><span>Ski</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-5"><span>Sne</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-3"><span>Ferie</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-4"><span>Solskin</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-1"><span>St. Anton</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-5"><span>Østrig</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-2"><span>Hop</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-3"><span>Buster Munk</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-1"><span>Ski</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-5"><span>Sne</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-3"><span>Ferie</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-4"><span>Solskin</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-1"><span>St. Anton</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-5"><span>Østrig</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-2"><span>Hop</span></a><xsl:text> </xsl:text>
								<a href="#" class="tag tag-3"><span>Buster Munk</span></a><xsl:text> </xsl:text>
								</div>
							</div>
						</div>
					</div>
					<hr/>
					<div class="info">
						<div class="inner_info">
							<div class="column left">
								<h2>Velkommen</h2>
								<p>OnlineObjects er et online fællesskab hvor mennesker kan <strong>udstille og udveksle information</strong>.
									Det er endnu usikkert hvordan det vil udvikle sig så du har rig mulighed for at <strong>påvirke det selv</strong>.</p>
								<p>Hvis du har <strong>ideer eller problemer</strong> er du også meget velkommen til at <a href="http://www.in2isoft.dk/kontakt/" class="link"><span>kontakte os</span></a>.</p>
								<p>Systemet er udviklet af <a href="http://www.in2isoft.dk/" class="link"><span>In2iSoft</span></a> og bygger på ideen om at information skal være
									<strong>frit</strong> og skal kunne <strong>sammenkædes</strong> frit.</p>
							</div>
							<div class="column center">
								<h2>Support</h2>
								<p>Systemet er i øjeblikket under udvikling så der er sandsynlighed for fejl.</p>
								<form action="login" method="get" accept-charset="utf-8" id="login">
									<div>
									<label>E-mail-adresse</label>
									<input type="text" name="username" value="" class="text"/>
									<label>Besked</label>
									<textarea name="message" rows="6"></textarea>
									<input type="submit" value="Afsend besked" class="submit"/>
									</div>
								</form>
							</div>
							<div class="column right">
								<h2>Bliv medlem</h2>
								<p>I øjeblikket kan man kun blive bruger ved at blive <strong>inviteret</strong> af en anden bruger.</p>
								<p>Hvis du gerne vil være bruger af systemet er du meget velkommen til at <a href="http://www.in2isoft.dk/kontakt/" class="link"><span>kontakte os</span></a>.</p>
							</div>
						</div>
					</div>
					<div class="footer">
							Designet og udviklet af <a href="http://www.in2isoft.dk/" class="link"><span>In2iSoft</span></a>
    						&#160;·&#160;<a href="http://validator.w3.org/check?uri=referer" class="link"><span>XHTML 1.0 Strict</span></a>
							&#160;·&#160;<a href="http://jigsaw.w3.org/css-validator/validator?uri=http%3A%2F%2Fcommunity.onlineobjects.com%2F&amp;warning=1&amp;profile=css3&amp;usermedium=all" class="link"><span>CSS 2.1</span></a>
					</div>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>