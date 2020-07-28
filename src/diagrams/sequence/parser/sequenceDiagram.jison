/** mermaid
 *  https://mermaidjs.github.io/
 *  (c) 2014-2015 Knut Sveidqvist
 *  MIT license.
 *
 *  Based on js sequence diagrams jison grammr
 *  http://bramp.github.io/js-sequence-diagrams/
 *  (c) 2012-2013 Andrew Brampton (bramp.net)
 *  Simplified BSD license.
 */
%lex

%options case-insensitive

// Special states for recognizing aliases
// A special state for grabbing text up to the first comment/newline
%x ID ALIAS LINE

// Directive states
%x open_directive type_directive arg_directive

%%

\%\%\{                                                          { this.begin('open_directive'); return 'open_directive'; }
<open_directive>((?:(?!\}\%\%)[^:.])*)                          { this.begin('type_directive'); return 'type_directive'; }
<type_directive>":"                                             { this.popState(); this.begin('arg_directive'); return ':'; }
<type_directive,arg_directive>\}\%\%                            { this.popState(); this.popState(); return 'close_directive'; }
<arg_directive>((?:(?!\}\%\%).|\n)*)                            return 'arg_directive';
[\n]+                                                           return 'NEWLINE';
\s+                                                             /* skip all whitespace */
<ID,ALIAS,LINE>((?!\n)\s)+                                      /* skip same-line whitespace */
<INITIAL,ID,ALIAS,LINE,arg_directive,type_directive,open_directive>\#[^\n]*   /* skip comments */
\%%(?!\{)[^\n]*                                                 /* skip comments */
[^\}]\%\%[^\n]*                                                 /* skip comments */
"participant"                                                   { this.begin('ID'); return 'participant'; }
<ID>[^\->:\n,;]+?(?=((?!\n)\s)+"as"(?!\n)\s|[#\n;]|$)           { yytext = yytext.trim(); this.begin('ALIAS'); return 'ACTOR'; }
<ALIAS>"as"                                                     { this.popState(); this.popState(); this.begin('LINE'); return 'AS'; }
<ALIAS>(?:)                                                     { this.popState(); this.popState(); return 'NEWLINE'; }
"loop"                                                          { this.begin('LINE'); return 'loop'; }
"rect"                                                          { this.begin('LINE'); return 'rect'; }
"opt"                                                           { this.begin('LINE'); return 'opt'; }
"alt"                                                           { this.begin('LINE'); return 'alt'; }
"else"                                                          { this.begin('LINE'); return 'else'; }
"par"                                                           { this.begin('LINE'); return 'par'; }
"and"                                                           { this.begin('LINE'); return 'and'; }
<LINE>(?:[:]?(?:no)?wrap:)?[^#\n;]*                             { this.popState(); return 'restOfLine'; }
"end"                                                           return 'end';
"left of"                                                       return 'left_of';
"right of"                                                      return 'right_of';
"over"                                                          return 'over';
"note"                                                          return 'note';
"activate"                                                      { this.begin('ID'); return 'activate'; }
"deactivate"                                                    { this.begin('ID'); return 'deactivate'; }
"title"                                                         return 'title';
"sequenceDiagram"                                               return 'SD';
"autonumber" 			                                        return 'autonumber';
","                                                             return ',';
";"                                                             return 'NEWLINE';
[^\+\->:\n,;]+((?!(\-x|\-\-x))[\-]*[^\+\->:\n,;]+)*             { yytext = yytext.trim(); return 'ACTOR'; }
"->>"                                                           return 'SOLID_ARROW';
"-->>"                                                          return 'DOTTED_ARROW';
"->"                                                            return 'SOLID_OPEN_ARROW';
"-->"                                                           return 'DOTTED_OPEN_ARROW';
\-[x]                                                           return 'SOLID_CROSS';
\-\-[x]                                                         return 'DOTTED_CROSS';
":"(?:(?:no)?wrap:)?[^#\n;]+                                    return 'TXT';
"+"                                                             return '+';
"-"                                                             return '-';
<<EOF>>                                                         return 'NEWLINE';
.                                                               return 'INVALID';

/lex

%left '^'

%start start

%% /* language grammar */

start
	: SPACE start
	| NEWLINE start
	| directive start
	| SD document { yy.apply($2);return $2; }
	;

document
	: /* empty */ { $$ = [] }
	| document line {$1.push($2);$$ = $1}
	;

line
	: SPACE statement { $$ = $2 }
	| statement { $$ = $1 }
	| NEWLINE { $$=[]; }
	;

directive
  : openDirective typeDirective closeDirective 'NEWLINE'
  | openDirective typeDirective ':' argDirective closeDirective 'NEWLINE'
  ;

statement
	: 'participant' actor 'AS' restOfLine 'NEWLINE' {$2.description=yy.parseMessage($4); $$=$2;}
	| 'participant' actor 'NEWLINE' {$$=$2;}
	| signal 'NEWLINE'
	| autonumber {yy.enableSequenceNumbers()}
	| 'activate' actor 'NEWLINE' {$$={type: 'activeStart', signalType: yy.LINETYPE.ACTIVE_START, actor: $2};}
	| 'deactivate' actor 'NEWLINE' {$$={type: 'activeEnd', signalType: yy.LINETYPE.ACTIVE_END, actor: $2};}
	| note_statement 'NEWLINE'
	| title text2 'NEWLINE' {$$=[{type:'setTitle', text:$2}]}
	| 'loop' restOfLine document end
	{
		$3.unshift({type: 'loopStart', loopText:yy.parseMessage($2), signalType: yy.LINETYPE.LOOP_START});
		$3.push({type: 'loopEnd', loopText:$2, signalType: yy.LINETYPE.LOOP_END});
		$$=$3;}
	| 'rect' restOfLine document end
	{
		$3.unshift({type: 'rectStart', color:yy.parseMessage($2), signalType: yy.LINETYPE.RECT_START });
		$3.push({type: 'rectEnd', color:yy.parseMessage($2), signalType: yy.LINETYPE.RECT_END });
		$$=$3;}
	| opt restOfLine document end
	{
		$3.unshift({type: 'optStart', optText:yy.parseMessage($2), signalType: yy.LINETYPE.OPT_START});
		$3.push({type: 'optEnd', optText:yy.parseMessage($2), signalType: yy.LINETYPE.OPT_END});
		$$=$3;}
	| alt restOfLine else_sections end
	{
		// Alt start
		$3.unshift({type: 'altStart', altText:yy.parseMessage($2), signalType: yy.LINETYPE.ALT_START});
		// Content in alt is already in $3
		// End
		$3.push({type: 'altEnd', signalType: yy.LINETYPE.ALT_END});
		$$=$3;}
	| par restOfLine par_sections end
	{
		// Parallel start
		$3.unshift({type: 'parStart', parText:yy.parseMessage($2), signalType: yy.LINETYPE.PAR_START});
		// Content in par is already in $3
		// End
		$3.push({type: 'parEnd', signalType: yy.LINETYPE.PAR_END});
		$$=$3;}
  | directive
	;

par_sections
	: document
	| document and restOfLine par_sections
	{ $$ = $1.concat([{type: 'and', parText:yy.parseMessage($3), signalType: yy.LINETYPE.PAR_AND}, $4]); }
	;

else_sections
	: document
	| document else restOfLine else_sections
	{ $$ = $1.concat([{type: 'else', altText:yy.parseMessage($3), signalType: yy.LINETYPE.ALT_ELSE}, $4]); }
	;

note_statement
	: 'note' placement actor text2
	{
		$$ = [$3, {type:'addNote', placement:$2, actor:$3.actor, text:$4}];}
	| 'note' 'over' actor_pair text2
	{
		// Coerce actor_pair into a [to, from, ...] array
		$2 = [].concat($3, $3).slice(0, 2);
		$2[0] = $2[0].actor;
		$2[1] = $2[1].actor;
		$$ = [$3, {type:'addNote', placement:yy.PLACEMENT.OVER, actor:$2.slice(0, 2), text:$4}];}
	;

spaceList
    : SPACE spaceList
    | SPACE
    ;
actor_pair
	: actor ',' actor   { $$ = [$1, $3]; }
	| actor             { $$ = $1; }
	;

placement
	: 'left_of'   { $$ = yy.PLACEMENT.LEFTOF; }
	| 'right_of'  { $$ = yy.PLACEMENT.RIGHTOF; }
	;

signal
	: actor signaltype '+' actor text2
	{ $$ = [$1,$4,{type: 'addMessage', from:$1.actor, to:$4.actor, signalType:$2, msg:$5},
	              {type: 'activeStart', signalType: yy.LINETYPE.ACTIVE_START, actor: $4}
	             ]}
	| actor signaltype '-' actor text2
	{ $$ = [$1,$4,{type: 'addMessage', from:$1.actor, to:$4.actor, signalType:$2, msg:$5},
	             {type: 'activeEnd', signalType: yy.LINETYPE.ACTIVE_END, actor: $1}
	             ]}
	| actor signaltype actor text2
	{ $$ = [$1,$3,{type: 'addMessage', from:$1.actor, to:$3.actor, signalType:$2, msg:$4}]}
	;

actor
	: ACTOR {$$={type: 'addActor', actor:$1}}
	;

signaltype
	: SOLID_OPEN_ARROW  { $$ = yy.LINETYPE.SOLID_OPEN; }
	| DOTTED_OPEN_ARROW { $$ = yy.LINETYPE.DOTTED_OPEN; }
	| SOLID_ARROW       { $$ = yy.LINETYPE.SOLID; }
	| DOTTED_ARROW      { $$ = yy.LINETYPE.DOTTED; }
	| SOLID_CROSS       { $$ = yy.LINETYPE.SOLID_CROSS; }
	| DOTTED_CROSS      { $$ = yy.LINETYPE.DOTTED_CROSS; }
	;

text2
  : TXT {$$ = yy.parseMessage($1.trim().substring(1)) }
  ;

openDirective
  : open_directive { yy.parseDirective('%%{', 'open_directive'); }
  ;

typeDirective
  : type_directive { yy.parseDirective($1, 'type_directive'); }
  ;

argDirective
  : arg_directive { $1 = $1.trim().replace(/'/g, '"'); yy.parseDirective($1, 'arg_directive'); }
  ;

closeDirective
  : close_directive { yy.parseDirective('}%%', 'close_directive', 'sequence'); }
  ;

%%
