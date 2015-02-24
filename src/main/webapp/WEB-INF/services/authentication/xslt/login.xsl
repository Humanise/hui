<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0"
	xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
	xmlns="http://www.w3.org/1999/xhtml"
 	xmlns:p="http://uri.onlineobjects.com/page/"
 	xmlns:e="http://uri.onlineobjects.com/model/Item/Entity/"
 	xmlns:user="http://uri.onlineobjects.com/model/Item/Entity/User/"
	exclude-result-prefixes="p e user"
	>

	<xsl:output encoding="UTF-8" method="xml" omit-xml-declaration="yes" doctype-public="-//W3C//DTD XHTML 1.0 Strict//EN" doctype-system="http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"/>
	
	<xsl:param name="local-context"/>
	<xsl:param name="base-context"/>
	
	<xsl:template match="p:page">
		<html>
			<head>
				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
				<title>Adgangskontrol</title>
				<link rel="stylesheet" href="{$base-context}/core/css/authentication.css" type="text/css" media="screen" title="front" charset="utf-8"/>
			</head>
			<body>
				<div class="base">
					<div class="body">
						<div class="centered">
							<div class="grey_box">
								<div class="grey_box_top"><div><div><xsl:comment/></div></div></div>
								<div class="grey_box_middle">
									<div class="logo_container">
									<h1>Adgangskontrol</h1>
									<p class="user">Nuværende bruger: <xsl:value-of select="//user:username"/></p>
									<xsl:choose>
										<xsl:when test="//p:action='loggedOut'"><p class="message"><strong>Du er nu logget ud</strong></p></xsl:when>
										<xsl:when test="//p:action='loggedIn'"><p class="message"><strong>Du er nu logget ind</strong></p></xsl:when>
										<xsl:when test="//p:action='appAccessDenied'"><p class="message"><strong>Den nuværende bruger har ikke adgang til den forespurgte applikation</strong></p></xsl:when>
										<xsl:when test="//p:action='invalidLogin'"><p class="message"><strong>Brugeren blev ikke fundet</strong></p></xsl:when>
									</xsl:choose>
									<form action="{$local-context}/authenticate" method="post">
										<p>
											<label>Brugernavn</label>
											<input type="text" class="text" name="username"/>
										</p>
										<p>
											<label>Adgangskode</label>
											<input type="password" class="text" name="password"/>
										</p>
										<p>
											<input type="hidden" name="redirect" value="{//p:redirect}"/>
											<input type="submit" class="submit" value="Log ind"/>
										</p>
										<p class="links">
											<a href="{$local-context}/logout" class="link"><span>Log ud</span></a>
										</p>
									</form>
									</div>
								</div>
								<div class="grey_box_bottom"><div><div><xsl:comment/></div></div></div>
							</div>
						</div>
					</div>
				</div>
				<div class="footer">
					<xsl:comment/>
				</div>
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>