<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns="http://www.w3.org/1999/xhtml"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:p="http://uri.onlineobjects.com/page/"
 xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 xmlns:u="http://uri.onlineobjects.com/model/Item/Entity/User/"
 exclude-result-prefixes="u e p"
>

	<xsl:output encoding="UTF-8" method="xml" omit-xml-declaration="yes" indent="no" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>

	<xsl:param name="local-context"/>
	<xsl:param name="base-context"/>
	<xsl:param name="base-domain-context"/>
	<xsl:param name="user-name"/>
	<xsl:param name="development-mode"/>
	<xsl:param name="domain-is-ip"/>

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
				appContext:'<xsl:value-of select="$local-context"/>',
				domainIsIP:<xsl:value-of select="$domain-is-ip"/>
			}
		</script>
		<script type='text/javascript' src='{$base-context}/dwr/interface/CoreSecurity.js'><xsl:comment/></script>
		<script type='text/javascript' src='{$base-context}/dwr/interface/AppCommunity.js'><xsl:comment/></script>
		<script type='text/javascript' src='{$base-context}/dwr/engine.js'><xsl:comment/></script>
		<script src="{$local-context}/js/community.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<script src="{$local-context}/js/front.js" type="text/javascript" charset="utf-8"><xsl:comment/></script>
		<xsl:if test="$development-mode='true'">
			<script type='text/javascript'>
			oo.community.Front.allowIE = true;
			</script>
		</xsl:if>
	</xsl:template>
	
	<xsl:template match="p:page">
		<html xmlns="http://www.w3.org/1999/xhtml">
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
				<title>OnlineMe</title>
				<link rel="stylesheet" href="{$local-context}/css/shared.css" type="text/css" media="screen" charset="utf-8"/>
				<link rel="stylesheet" href="{$local-context}/css/home.css" type="text/css" media="screen" charset="utf-8"/>
				<xsl:comment><![CDATA[[if lt IE 7]>
					<link rel="stylesheet" type="text/css" href="]]><xsl:value-of select="$local-context"/><![CDATA[/css/msie6.css"> </link>
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
										<div class="intro">
											<h2>Velkommen</h2>
											<p><em>OnlineMe</em> er et online fællesskab hvor mennesker kan <strong>udstille og udveksle information</strong>.
												Det er endnu usikkert hvordan det vil udvikle sig så du har rig mulighed for at <strong>påvirke det selv</strong>.</p>
											<p>Hvis du har <strong>ideer eller problemer</strong> er du også meget velkommen til at <a href="http://www.in2isoft.dk/kontakt/" class="link"><span>kontakte os</span></a>.</p>
											<p>Systemet er udviklet af <a href="http://www.in2isoft.dk/" class="link"><span>In2iSoft</span></a> og bygger på ideen om at information skal være
												<strong>frit</strong> og skal kunne <strong>sammenkædes</strong> frit.</p>
										</div>
										<form action="#" method="get" accept-charset="utf-8" class="filter">
											<div><div><input type="text" name="query" value="" id="search_field" class="text"/></div></div>
										</form>
										<div class="section">
											<div class="section_head"><h2>Billeder</h2></div>
											<div class="section_body"><div id="images_container"><xsl:comment/></div></div>
										</div>
										<div class="section">
											<div class="section_head"><h2>Mennesker</h2></div>
											<div class="section_body"><div id="users_container"><xsl:comment/></div></div>
										</div>
										<div class="section">
											<div class="section_head"><h2>Nøgleord</h2></div>
											<div id="tags_container" class="cloud"><xsl:comment/></div>
										</div>
										<div class="support">
											<h2>Support</h2>
											<p>Anvend formularen herunder til at sende os feedback om problemer eller ønsker om forbedring.</p>
											<form action="#" method="get" accept-charset="utf-8" id="feedbackForm" class="formula">
												<p>
												<label>E-mail-adresse</label>
												<input type="text" name="email" value="" class="text"/>
												</p>
												<p>
												<label>Besked</label>
												<textarea name="message" rows="6" cols="20"><xsl:text> </xsl:text></textarea>
												</p>
												<p>
												<input type="submit" value="Afsend besked" class="submit"/>
												</p>
											</form>
										</div>
									</div>
									<div class="content_right">
										<h2>Log ind</h2>
										<form action="login" method="get" accept-charset="utf-8" id="login" class="formula">
											<div>
												<p>
													<label>Brugernavn</label>
													<span class="field"><span><span><input type="text" name="username" value="" class="text"/></span></span></span>
												</p>
												<p>
													<label>Adgangskode</label>
													<span class="field"><span><span><input type="password" name="password" value="" class="text"/></span></span></span>
												</p>
												<p class="buttons">
													<input type="submit" value="Log ind" class="submit"/>
													<a class="sidebar_button" href="#"><span><span>Log ind</span></span></a>
												</p>
											</div>
										</form>
										<h2>Ny bruger</h2>
										<form action="signup" method="get" accept-charset="utf-8" id="signup" class="formula">
											<div>
												<p class="response"><xsl:comment/></p>
												<p>
													<label>Brugernavn</label>
													<span class="field"><span><span><input type="text" name="abc" value="" class="text"/></span></span></span>
													<span class="hint">Kun små bogstaver og/eller tal</span>
												</p>
												<p>
													<label>Kodeord</label>
													<span class="field"><span><span><input type="password" name="def" value="" class="text"/></span></span></span>
													<span class="hint">Gerne langt og med tal og tegn</span>
												</p>
												<p>
													<label>Navn</label>
													<span class="field"><span><span><input type="text" name="name" value="" class="text"/></span></span></span>
													<span class="hint">F.eks: Jens Petersen</span>
												</p>
												<p>
													<label>E-post</label>
													<span class="field"><span><span><input type="text" name="email" value="" class="text"/></span></span></span>
													<span class="hint">F.eks: jens@mail.dk</span>
												</p>
												<p class="buttons">
													<input type="submit" value="Tilmeld" class="submit"/>
													<a class="sidebar_button" href="#"><span><span>Tilmeld</span></span></a>
												</p>
											</div>
										</form>
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
</xsl:stylesheet>