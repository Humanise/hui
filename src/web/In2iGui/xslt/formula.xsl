<?xml version="1.0"?>
<xsl:stylesheet
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:gui="uri:In2iGui"
    version="1.0"
    exclude-result-prefixes="gui"
    >

<xsl:template match="gui:formula">
	<form class="in2igui_formula" id="{generate-id()}">
		<xsl:apply-templates/>
	</form>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula('<xsl:value-of select="generate-id()"/>');
		with (<xsl:value-of select="generate-id()"/>_obj) {
		<xsl:for-each select="descendant::gui:group/gui:text | descendant::gui:group/gui:checkboxes | descendant::gui:group/gui:checkbox | descendant::gui:group/gui:radiobuttons">
			registerInput(<xsl:value-of select="generate-id()"/>_obj);
		</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:formula//gui:header">
	<div class="formula_header"><xsl:apply-templates/></div>
</xsl:template>

<xsl:template match="gui:formula//gui:group">
	<table class="group">
		<xsl:apply-templates/>
	</table>
</xsl:template>

<xsl:template match="gui:formula//gui:group[@labels='above']">
	<table class="group group_above">
		<xsl:apply-templates/>
	</table>
</xsl:template>

<xsl:template match="gui:formula//gui:group[@legend]">
	<fieldset>
		<legend><xsl:value-of select="@legend"/></legend>
		<table class="group">
			<xsl:apply-templates/>
		</table>
	</fieldset>
</xsl:template>

<xsl:template match="gui:group/gui:custom">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:apply-templates/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:custom">
	<tr><td>
			<label><xsl:value-of select="@label"/></label>
			<xsl:apply-templates/>
	</td></tr>
</xsl:template>

<!-- Text -->

<xsl:template match="gui:group/gui:text">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:text"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:text">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:text"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:text">
	<div class="field">
	<xsl:choose>
		<xsl:when test="@lines>1">
			<textarea class="text" rows="{@lines}" id="{generate-id()}"/>
		</xsl:when>
		<xsl:otherwise>
			<input type="text" class="text" id="{generate-id()}"/>
		</xsl:otherwise>
	</xsl:choose>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Text('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Radio buttons -->



<xsl:template match="gui:group/gui:radiobuttons">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:radiobuttons"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:radiobuttons">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:radiobuttons"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:radiobuttons">
	<div class="radiobuttons" id="{generate-id()}">
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Radiobuttons('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{'value':'<xsl:value-of select="@value"/>'});
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:radiobutton">
				registerRadiobutton({id:'<xsl:value-of select="generate-id()"/>','value':'<xsl:value-of select="@value"/>'});
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:radiobuttons/gui:radiobutton">
	<div id="{generate-id()}">
		<xsl:attribute name="class">radiobutton <xsl:if test="@value=../@value">selected</xsl:if></xsl:attribute>
		<div class="radio"><xsl:comment/></div><xsl:value-of select="@label"/>
	</div>
</xsl:template>

<!-- Checkbox -->

<xsl:template match="gui:group/gui:checkbox">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:checkbox"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:checkbox">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:checkboxes"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:checkbox">
	<div id="{generate-id()}">
		<xsl:attribute name="class">
			<xsl:text>checkbox</xsl:text>
			<xsl:if test="@value='true'"> checked</xsl:if>
		</xsl:attribute>
		<div class="check"><xsl:comment/></div>
	</div>
	<div class="checkboxes">
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Checkbox('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{'value':'<xsl:value-of select="@value"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Checkboxes -->

<xsl:template match="gui:group/gui:checkboxes">
	<tr>
		<th><label><xsl:value-of select="@label"/></label></th>
		<td><xsl:call-template name="gui:checkboxes"/></td>
	</tr>
</xsl:template>

<xsl:template match="gui:group[@labels='above']/gui:checkboxes">
	<tr><td>
		<label><xsl:value-of select="@label"/></label>
		<xsl:call-template name="gui:checkboxes"/>
	</td></tr>
</xsl:template>

<xsl:template name="gui:checkboxes">
	<div class="checkboxes" id="{generate-id()}">
		<xsl:apply-templates/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Checkboxes('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:source">
				registerSource(<xsl:value-of select="generate-id()"/>_obj);
			</xsl:for-each>
		}
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:checkboxes/gui:source">
	<div id="{generate-id()}">
		<xsl:comment/>
	</div>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Formula.Checkboxes.Source('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>',{url:'<xsl:value-of select="@url"/>'});
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<!-- Buttons -->

<xsl:template match="gui:formula/gui:buttons">
	<div class="in2igui_formula_buttons">
		<xsl:if test="@pad"><xsl:attribute name="style">padding: <xsl:value-of select="@pad"/>px;</xsl:attribute></xsl:if>
		<xsl:apply-templates/>
	</div>
</xsl:template>

<xsl:template match="gui:group/gui:buttons">
	<tr>
		<td colspan="2">
			<xsl:apply-templates/>
		</td>
	</tr>
</xsl:template>

<xsl:template match="gui:buttons/gui:button">
	<a class="in2igui_button" id="{generate-id()}">
		<xsl:attribute name="class">in2igui_button<xsl:if test="@highlighted='true'"> in2igui_button_highlighted</xsl:if></xsl:attribute>
		<span><span><xsl:value-of select="@title"/></span></span></a>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Button('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>

<xsl:template match="gui:group/gui:button">
	<tr>
		<td colspan="2"><a class="in2igui_button" id="{generate-id()}"><span><span><xsl:value-of select="@title"/></span></span></a></td>
	</tr>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.Button('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>


<!--                Image                -->

<xsl:template match="gui:group/gui:imagepicker">
	<tr><td colspan="2">
		<div class="in2igui_imagepicker" id="{generate-id()}">
			
		</div>
	</td></tr>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.ImagePicker(
			'<xsl:value-of select="generate-id()"/>',
			'<xsl:value-of select="@name"/>',
			{'source':'<xsl:value-of select="@source"/>'}
			);
		<xsl:call-template name="gui:createobject"/>
	</script>
</xsl:template>


<!--             Object List             -->




<xsl:template match="gui:group/gui:objectlist">
	<tr><td colspan="2">
		<xsl:call-template name="gui:objectlist"/>
	</td></tr>
</xsl:template>

<xsl:template match="gui:objectlist" name="gui:objectlist">
	<table cellspacing="0" cellpadding="0" id="{generate-id()}" class="in2igui_objectlist">
		<xsl:if test="gui:text/@label">
			<thead>
				<tr>
					<xsl:for-each select="gui:text">
						<th class="in2igui_objectlist in2igui_objectlist{position()}"><xsl:value-of select="@label"/></th>
					</xsl:for-each>
				</tr>
			</thead>
		</xsl:if>
		<tbody>
			<xsl:comment/>
		</tbody>
	</table>
	<script type="text/javascript">
		var <xsl:value-of select="generate-id()"/>_obj = new In2iGui.ObjectList('<xsl:value-of select="generate-id()"/>','<xsl:value-of select="@name"/>');
		<xsl:call-template name="gui:createobject"/>
		with (<xsl:value-of select="generate-id()"/>_obj) {
			<xsl:for-each select="gui:text">
				registerTemplateItem('<xsl:value-of select="@key"/>','textfield');
			</xsl:for-each>
			ignite();
		}
	</script>
</xsl:template>

</xsl:stylesheet>