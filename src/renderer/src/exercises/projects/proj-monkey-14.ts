import { Exercise } from '../../types'

const exercise: Exercise = {
  id: 'proj-monkey-14',
  title: 'Evaluator — Infix Expressions',
  category: 'Projects',
  subcategory: 'Monkey Interpreter',
  difficulty: 'intermediate',
  order: 114,
  description: `Add infix expression evaluation to the Eval function.

Extend Eval to handle InfixExpression nodes. Support these operators:
- Arithmetic: +, -, *, / (integers only, return IntegerObject)
- Comparison: <, > (integers only, return BooleanObject)
- Equality: ==, != (works for both integers and booleans)

For integer operations, both operands must be integers.
For boolean equality, compare using pointer equality (the singletons TRUE_OBJ/FALSE_OBJ).
Return an ErrorObject for type mismatches or unknown operators.`,
  code: `package main
// ─── Lexer ───────────────────────────────────────────
type TokenType string
type Token struct{ Type TokenType; Literal string }
const (
	ILLEGAL="ILLEGAL"; EOF_TOKEN="EOF"; IDENT="IDENT"; INT="INT"; STRING="STRING"
	ASSIGN="="; PLUS="+"; MINUS="-"; BANG="!"; ASTERISK="*"; SLASH="/"
	LT="<"; GT=">"; EQ="=="; NOT_EQ="!="
	COMMA=","; SEMICOLON=";"; COLON=":"
	LPAREN="("; RPAREN=")"; LBRACE="{"; RBRACE="}"; LBRACKET="["; RBRACKET="]"
	FUNCTION="FUNCTION"; LET="LET"; TRUE="TRUE"; FALSE="FALSE"
	IF="IF"; ELSE="ELSE"; RETURN="RETURN"
)
var keywords = map[string]TokenType{"fn":FUNCTION,"let":LET,"true":TRUE,"false":FALSE,"if":IF,"else":ELSE,"return":RETURN}
type Lexer struct{ input string; pos,readPos int; ch byte }
func NewLexer(in string)*Lexer{ l:=&Lexer{input:in}; l.readChar(); return l }
func (l *Lexer) readChar(){ if l.readPos>=len(l.input){l.ch=0}else{l.ch=l.input[l.readPos]}; l.pos=l.readPos; l.readPos++ }
func (l *Lexer) peekChar()byte{ if l.readPos>=len(l.input){return 0}; return l.input[l.readPos] }
func (l *Lexer) skipWS(){ for l.ch==' '||l.ch=='\\t'||l.ch=='\\n'||l.ch=='\\r'{l.readChar()} }
func (l *Lexer) readIdent()string{ p:=l.pos; for isL(l.ch){l.readChar()}; return l.input[p:l.pos] }
func (l *Lexer) readNum()string{ p:=l.pos; for isD(l.ch){l.readChar()}; return l.input[p:l.pos] }
func (l *Lexer) readStr()string{ l.readChar(); p:=l.pos; for l.ch!='"'&&l.ch!=0{l.readChar()}; s:=l.input[p:l.pos]; l.readChar(); return s }
func isL(c byte)bool{ return c>='a'&&c<='z'||c>='A'&&c<='Z'||c=='_' }
func isD(c byte)bool{ return c>='0'&&c<='9' }
func (l *Lexer) NextToken() Token {
	l.skipWS(); var t Token
	switch l.ch {
	case '=': if l.peekChar()=='='{l.readChar();t=Token{EQ,"=="}}else{t=Token{ASSIGN,"="}}
	case '!': if l.peekChar()=='='{l.readChar();t=Token{NOT_EQ,"!="}}else{t=Token{BANG,"!"}}
	case '+': t=Token{PLUS,"+"}; case '-': t=Token{MINUS,"-"}
	case '*': t=Token{ASTERISK,"*"}; case '/': t=Token{SLASH,"/"}
	case '<': t=Token{LT,"<"}; case '>': t=Token{GT,">"}
	case ',': t=Token{COMMA,","}; case ';': t=Token{SEMICOLON,";"}; case ':': t=Token{COLON,":"}
	case '(': t=Token{LPAREN,"("}; case ')': t=Token{RPAREN,")"}
	case '{': t=Token{LBRACE,"{"}; case '}': t=Token{RBRACE,"}"}
	case '[': t=Token{LBRACKET,"["}; case ']': t=Token{RBRACKET,"]"}
	case '"': return Token{STRING,l.readStr()}
	case 0: t=Token{EOF_TOKEN,""}
	default:
		if isL(l.ch){lit:=l.readIdent();tp:=IDENT;if k,ok:=keywords[lit];ok{tp=k};return Token{tp,lit}}
		if isD(l.ch){return Token{INT,l.readNum()}}
		t=Token{ILLEGAL,string(l.ch)}
	}; l.readChar(); return t
}
// ─── AST ─────────────────────────────────────────────
type Node interface{ TokenLiteral()string; String()string }
type Statement interface{ Node; statementNode() }
type Expression interface{ Node; expressionNode() }
type Program struct{ Statements []Statement }
func (p *Program) TokenLiteral()string{ if len(p.Statements)>0{return p.Statements[0].TokenLiteral()};return"" }
func (p *Program) String()string{ s:="";for _,st:=range p.Statements{s+=st.String()};return s }
type LetStatement struct{ Token Token; Name *Identifier; Value Expression }
func (s *LetStatement) statementNode(){}; func (s *LetStatement) TokenLiteral()string{return s.Token.Literal}
func (s *LetStatement) String()string{return"let "+s.Name.String()+" = "+s.Value.String()+";"}
type ReturnStatement struct{ Token Token; ReturnValue Expression }
func (s *ReturnStatement) statementNode(){}; func (s *ReturnStatement) TokenLiteral()string{return s.Token.Literal}
func (s *ReturnStatement) String()string{return"return "+s.ReturnValue.String()+";"}
type ExpressionStatement struct{ Token Token; Expression Expression }
func (s *ExpressionStatement) statementNode(){}; func (s *ExpressionStatement) TokenLiteral()string{return s.Token.Literal}
func (s *ExpressionStatement) String()string{if s.Expression!=nil{return s.Expression.String()};return""}
type BlockStatement struct{ Token Token; Statements []Statement }
func (s *BlockStatement) statementNode(){}; func (s *BlockStatement) TokenLiteral()string{return s.Token.Literal}
func (s *BlockStatement) String()string{s2:="";for _,st:=range s.Statements{s2+=st.String()};return s2}
type Identifier struct{ Token Token; Value string }
func (x *Identifier) expressionNode(){}; func (x *Identifier) TokenLiteral()string{return x.Token.Literal}; func (x *Identifier) String()string{return x.Value}
type IntegerLiteral struct{ Token Token; Value int64 }
func (x *IntegerLiteral) expressionNode(){}; func (x *IntegerLiteral) TokenLiteral()string{return x.Token.Literal}; func (x *IntegerLiteral) String()string{return x.Token.Literal}
type BooleanLiteral struct{ Token Token; Value bool }
func (x *BooleanLiteral) expressionNode(){}; func (x *BooleanLiteral) TokenLiteral()string{return x.Token.Literal}; func (x *BooleanLiteral) String()string{return x.Token.Literal}
type StringLiteral struct{ Token Token; Value string }
func (x *StringLiteral) expressionNode(){}; func (x *StringLiteral) TokenLiteral()string{return x.Token.Literal}; func (x *StringLiteral) String()string{return"\\""+x.Value+"\\""}
type PrefixExpression struct{ Token Token; Operator string; Right Expression }
func (x *PrefixExpression) expressionNode(){}; func (x *PrefixExpression) TokenLiteral()string{return x.Token.Literal}
func (x *PrefixExpression) String()string{return"("+x.Operator+x.Right.String()+")"}
type InfixExpression struct{ Token Token; Left Expression; Operator string; Right Expression }
func (x *InfixExpression) expressionNode(){}; func (x *InfixExpression) TokenLiteral()string{return x.Token.Literal}
func (x *InfixExpression) String()string{return"("+x.Left.String()+" "+x.Operator+" "+x.Right.String()+")"}
type IfExpression struct{ Token Token; Condition Expression; Consequence,Alternative *BlockStatement }
func (x *IfExpression) expressionNode(){}; func (x *IfExpression) TokenLiteral()string{return x.Token.Literal}
func (x *IfExpression) String()string{s:="if "+x.Condition.String()+" "+x.Consequence.String();if x.Alternative!=nil{s+=" else "+x.Alternative.String()};return s}
type FunctionLiteral struct{ Token Token; Parameters []*Identifier; Body *BlockStatement }
func (x *FunctionLiteral) expressionNode(){}; func (x *FunctionLiteral) TokenLiteral()string{return x.Token.Literal}
func (x *FunctionLiteral) String()string{s:="fn(";for i,p:=range x.Parameters{if i>0{s+=", "};s+=p.String()};return s+") "+x.Body.String()}
type CallExpression struct{ Token Token; Function Expression; Arguments []Expression }
func (x *CallExpression) expressionNode(){}; func (x *CallExpression) TokenLiteral()string{return x.Token.Literal}
func (x *CallExpression) String()string{s:=x.Function.String()+"(";for i,a:=range x.Arguments{if i>0{s+=", "};s+=a.String()};return s+")"}
type ArrayLiteral struct{ Token Token; Elements []Expression }
func (x *ArrayLiteral) expressionNode(){}; func (x *ArrayLiteral) TokenLiteral()string{return x.Token.Literal}
func (x *ArrayLiteral) String()string{s:="[";for i,e:=range x.Elements{if i>0{s+=", "};s+=e.String()};return s+"]"}
type IndexExpression struct{ Token Token; Left,Index Expression }
func (x *IndexExpression) expressionNode(){}; func (x *IndexExpression) TokenLiteral()string{return x.Token.Literal}
func (x *IndexExpression) String()string{return"("+x.Left.String()+"["+x.Index.String()+"])"}
type HashLiteral struct{ Token Token; Pairs map[Expression]Expression }
func (x *HashLiteral) expressionNode(){}; func (x *HashLiteral) TokenLiteral()string{return x.Token.Literal}
func (x *HashLiteral) String()string{s:="{";i:=0;for k,v:=range x.Pairs{if i>0{s+=", "};s+=k.String()+":"+v.String();i++};return s+"}"}
// ─── Parser ──────────────────────────────────────────
import ("fmt";"strconv")
const (_int=iota;LOWEST;EQUALS;LESSGREATER;SUM;PRODUCT;PREFIX;CALL;INDEX)
var precedences=map[TokenType]int{EQ:EQUALS,NOT_EQ:EQUALS,LT:LESSGREATER,GT:LESSGREATER,PLUS:SUM,MINUS:SUM,SLASH:PRODUCT,ASTERISK:PRODUCT,LPAREN:CALL,LBRACKET:INDEX}
type Parser struct{l*Lexer;curToken,peekToken Token;errors[]string;prefixParseFns map[TokenType]func()Expression;infixParseFns map[TokenType]func(Expression)Expression}
func NewParser(l*Lexer)*Parser{
	p:=&Parser{l:l,errors:[]string{}}
	p.prefixParseFns=map[TokenType]func()Expression{IDENT:p.parseIdent,INT:p.parseInt,TRUE:p.parseBool,FALSE:p.parseBool,STRING:p.parseStr,BANG:p.parsePrefix,MINUS:p.parsePrefix,LPAREN:p.parseGroup,IF:p.parseIf,FUNCTION:p.parseFn,LBRACKET:p.parseArr,LBRACE:p.parseHash}
	p.infixParseFns=map[TokenType]func(Expression)Expression{PLUS:p.parseInfix,MINUS:p.parseInfix,SLASH:p.parseInfix,ASTERISK:p.parseInfix,EQ:p.parseInfix,NOT_EQ:p.parseInfix,LT:p.parseInfix,GT:p.parseInfix,LPAREN:p.parseCall,LBRACKET:p.parseIdx}
	p.nextToken();p.nextToken();return p
}
func (p *Parser)Errors()[]string{return p.errors}
func (p *Parser)nextToken(){p.curToken=p.peekToken;p.peekToken=p.l.NextToken()}
func (p *Parser)curIs(t TokenType)bool{return p.curToken.Type==t}
func (p *Parser)peekIs(t TokenType)bool{return p.peekToken.Type==t}
func (p *Parser)expectPeek(t TokenType)bool{if p.peekIs(t){p.nextToken();return true};p.errors=append(p.errors,fmt.Sprintf("expected %s, got %s",t,p.peekToken.Type));return false}
func (p *Parser)peekPrec()int{if pr,ok:=precedences[p.peekToken.Type];ok{return pr};return LOWEST}
func (p *Parser)curPrec()int{if pr,ok:=precedences[p.curToken.Type];ok{return pr};return LOWEST}
func (p *Parser) ParseProgram()*Program{prog:=&Program{};for !p.curIs(EOF_TOKEN){if s:=p.parseStmt();s!=nil{prog.Statements=append(prog.Statements,s)};p.nextToken()};return prog}
func (p *Parser)parseStmt()Statement{switch p.curToken.Type{case LET:return p.parseLet();case RETURN:return p.parseRet();default:return p.parseExprStmt()}}
func (p *Parser)parseLet()*LetStatement{s:=&LetStatement{Token:p.curToken};if !p.expectPeek(IDENT){return nil};s.Name=&Identifier{Token:p.curToken,Value:p.curToken.Literal};if !p.expectPeek(ASSIGN){return nil};p.nextToken();s.Value=p.parseExpr(LOWEST);if p.peekIs(SEMICOLON){p.nextToken()};return s}
func (p *Parser)parseRet()*ReturnStatement{s:=&ReturnStatement{Token:p.curToken};p.nextToken();s.ReturnValue=p.parseExpr(LOWEST);if p.peekIs(SEMICOLON){p.nextToken()};return s}
func (p *Parser)parseExprStmt()*ExpressionStatement{s:=&ExpressionStatement{Token:p.curToken,Expression:p.parseExpr(LOWEST)};if p.peekIs(SEMICOLON){p.nextToken()};return s}
func (p *Parser)parseExpr(prec int)Expression{pfx:=p.prefixParseFns[p.curToken.Type];if pfx==nil{return nil};left:=pfx();for !p.peekIs(SEMICOLON)&&prec<p.peekPrec(){ifx:=p.infixParseFns[p.peekToken.Type];if ifx==nil{return left};p.nextToken();left=ifx(left)};return left}
func (p *Parser)parseIdent()Expression{return &Identifier{Token:p.curToken,Value:p.curToken.Literal}}
func (p *Parser)parseInt()Expression{v,e:=strconv.ParseInt(p.curToken.Literal,0,64);if e!=nil{return nil};return &IntegerLiteral{Token:p.curToken,Value:v}}
func (p *Parser)parseBool()Expression{return &BooleanLiteral{Token:p.curToken,Value:p.curIs(TRUE)}}
func (p *Parser)parseStr()Expression{return &StringLiteral{Token:p.curToken,Value:p.curToken.Literal}}
func (p *Parser)parsePrefix()Expression{e:=&PrefixExpression{Token:p.curToken,Operator:p.curToken.Literal};p.nextToken();e.Right=p.parseExpr(PREFIX);return e}
func (p *Parser)parseInfix(left Expression)Expression{e:=&InfixExpression{Token:p.curToken,Operator:p.curToken.Literal,Left:left};pr:=p.curPrec();p.nextToken();e.Right=p.parseExpr(pr);return e}
func (p *Parser)parseGroup()Expression{p.nextToken();exp:=p.parseExpr(LOWEST);if !p.expectPeek(RPAREN){return nil};return exp}
func (p *Parser)parseIf()Expression{e:=&IfExpression{Token:p.curToken};if !p.expectPeek(LPAREN){return nil};p.nextToken();e.Condition=p.parseExpr(LOWEST);if !p.expectPeek(RPAREN){return nil};if !p.expectPeek(LBRACE){return nil};e.Consequence=p.parseBlock();if p.peekIs(ELSE){p.nextToken();if !p.expectPeek(LBRACE){return nil};e.Alternative=p.parseBlock()};return e}
func (p *Parser)parseBlock()*BlockStatement{b:=&BlockStatement{Token:p.curToken};p.nextToken();for !p.curIs(RBRACE)&&!p.curIs(EOF_TOKEN){if s:=p.parseStmt();s!=nil{b.Statements=append(b.Statements,s)};p.nextToken()};return b}
func (p *Parser)parseFn()Expression{fl:=&FunctionLiteral{Token:p.curToken};if !p.expectPeek(LPAREN){return nil};fl.Parameters=p.parseParams();if !p.expectPeek(LBRACE){return nil};fl.Body=p.parseBlock();return fl}
func (p *Parser)parseParams()[]*Identifier{ids:=[]*Identifier{};if p.peekIs(RPAREN){p.nextToken();return ids};p.nextToken();ids=append(ids,&Identifier{Token:p.curToken,Value:p.curToken.Literal});for p.peekIs(COMMA){p.nextToken();p.nextToken();ids=append(ids,&Identifier{Token:p.curToken,Value:p.curToken.Literal})};if !p.expectPeek(RPAREN){return nil};return ids}
func (p *Parser)parseCall(fn Expression)Expression{return &CallExpression{Token:p.curToken,Function:fn,Arguments:p.parseExprList(RPAREN)}}
func (p *Parser)parseExprList(end TokenType)[]Expression{list:=[]Expression{};if p.peekIs(end){p.nextToken();return list};p.nextToken();list=append(list,p.parseExpr(LOWEST));for p.peekIs(COMMA){p.nextToken();p.nextToken();list=append(list,p.parseExpr(LOWEST))};if !p.expectPeek(end){return nil};return list}
func (p *Parser)parseArr()Expression{return &ArrayLiteral{Token:p.curToken,Elements:p.parseExprList(RBRACKET)}}
func (p *Parser)parseIdx(left Expression)Expression{e:=&IndexExpression{Token:p.curToken,Left:left};p.nextToken();e.Index=p.parseExpr(LOWEST);if !p.expectPeek(RBRACKET){return nil};return e}
func (p *Parser)parseHash()Expression{h:=&HashLiteral{Token:p.curToken,Pairs:map[Expression]Expression{}};for !p.peekIs(RBRACE){p.nextToken();k:=p.parseExpr(LOWEST);if !p.expectPeek(COLON){return nil};p.nextToken();v:=p.parseExpr(LOWEST);h.Pairs[k]=v;if !p.peekIs(RBRACE)&&!p.expectPeek(COMMA){return nil}};if !p.expectPeek(RBRACE){return nil};return h}
// ─── Object System ───────────────────────────────────
type ObjectType string
const (INTEGER_OBJ ObjectType="INTEGER";BOOLEAN_OBJ ObjectType="BOOLEAN";NULL_OBJ ObjectType="NULL";ERROR_OBJ ObjectType="ERROR";RETURN_VALUE_OBJ ObjectType="RETURN_VALUE")
type Object interface{Type()ObjectType;Inspect()string}
type IntegerObject struct{Value int64}
func (o *IntegerObject)Type()ObjectType{return INTEGER_OBJ};func (o *IntegerObject)Inspect()string{return fmt.Sprintf("%d",o.Value)}
type BooleanObject struct{Value bool}
func (o *BooleanObject)Type()ObjectType{return BOOLEAN_OBJ};func (o *BooleanObject)Inspect()string{return fmt.Sprintf("%t",o.Value)}
type NullObject struct{}
func (o *NullObject)Type()ObjectType{return NULL_OBJ};func (o *NullObject)Inspect()string{return"null"}
type ErrorObject struct{Message string}
func (o *ErrorObject)Type()ObjectType{return ERROR_OBJ};func (o *ErrorObject)Inspect()string{return"ERROR: "+o.Message}
type ReturnValueObject struct{Value Object}
func (o *ReturnValueObject)Type()ObjectType{return RETURN_VALUE_OBJ};func (o *ReturnValueObject)Inspect()string{return o.Value.Inspect()}
type Environment struct{store map[string]Object;outer *Environment}
func NewEnvironment()*Environment{return &Environment{store:map[string]Object{}}}
func NewEnclosedEnvironment(outer *Environment)*Environment{e:=NewEnvironment();e.outer=outer;return e}
func (e *Environment)Get(name string)(Object,bool){o,ok:=e.store[name];if !ok&&e.outer!=nil{o,ok=e.outer.Get(name)};return o,ok}
func (e *Environment)Set(name string,val Object)Object{e.store[name]=val;return val}
// ─── Evaluator (from step 13) ────────────────────────
var (TRUE_OBJ=&BooleanObject{Value:true};FALSE_OBJ=&BooleanObject{Value:false};NULL=&NullObject{})
func newError(f string,a ...interface{})*ErrorObject{return &ErrorObject{Message:fmt.Sprintf(f,a...)}}
func isError(obj Object)bool{return obj!=nil&&obj.Type()==ERROR_OBJ}
func nativeBoolToBooleanObject(b bool)*BooleanObject{if b{return TRUE_OBJ};return FALSE_OBJ}

func evalBangOperator(right Object)Object{switch right{case TRUE_OBJ:return FALSE_OBJ;case FALSE_OBJ:return TRUE_OBJ;case NULL:return TRUE_OBJ;default:return FALSE_OBJ}}
func evalMinusPrefix(right Object)Object{if right.Type()!=INTEGER_OBJ{return newError("unknown operator: -%s",right.Type())};return &IntegerObject{Value:-right.(*IntegerObject).Value}}
func evalPrefixExpression(op string,right Object)Object{switch op{case "!":return evalBangOperator(right);case "-":return evalMinusPrefix(right)};return newError("unknown operator: %s%s",op,right.Type())}

// TODO: Add *InfixExpression case to Eval
// TODO: Implement evalInfixExpression(op string, left, right Object) Object
//   - If both INTEGER_OBJ: handle +, -, *, /, <, >, ==, !=
//   - If operator is == or !=: compare by pointer (for booleans)
//   - Otherwise: return error for type mismatch or unknown operator
// TODO: Implement evalIntegerInfixExpression(op string, left, right Object) Object

func Eval(node Node, env *Environment) Object {
	switch node := node.(type) {
	case *Program:
		return evalProgram(node, env)
	case *ExpressionStatement:
		return Eval(node.Expression, env)
	case *IntegerLiteral:
		return &IntegerObject{Value: node.Value}
	case *BooleanLiteral:
		return nativeBoolToBooleanObject(node.Value)
	case *PrefixExpression:
		right := Eval(node.Right, env)
		if isError(right) { return right }
		return evalPrefixExpression(node.Operator, right)
	// TODO: Add *InfixExpression case here
	}
	return NULL
}

func evalProgram(program *Program, env *Environment) Object {
	var result Object
	for _, stmt := range program.Statements {
		result = Eval(stmt, env)
		if errObj, ok := result.(*ErrorObject); ok { return errObj }
	}
	return result
}

func main() {}
`,
  testCode: `package main

import "testing"

func testEval(input string) Object {
	l := NewLexer(input)
	p := NewParser(l)
	prog := p.ParseProgram()
	return Eval(prog, NewEnvironment())
}

func TestEvalIntegerInfix(t *testing.T) {
	tests := []struct{ input string; expected int64 }{
		{"5 + 5", 10}, {"5 - 5", 0}, {"5 * 5", 25}, {"5 / 5", 1},
		{"2 + 3 * 4", 14}, {"(2 + 3) * 4", 20},
		{"-5 + 10", 5}, {"50 / 2 * 2 + 10", 60},
	}
	for _, tt := range tests {
		obj := testEval(tt.input)
		result, ok := obj.(*IntegerObject)
		if !ok { t.Fatalf("for %s: expected IntegerObject, got %T (%v)", tt.input, obj, obj) }
		if result.Value != tt.expected { t.Errorf("for %s: expected %d, got %d", tt.input, tt.expected, result.Value) }
	}
}

func TestEvalBooleanInfix(t *testing.T) {
	tests := []struct{ input string; expected bool }{
		{"1 < 2", true}, {"1 > 2", false}, {"1 == 1", true}, {"1 != 1", false},
		{"1 == 2", false}, {"1 != 2", true},
		{"true == true", true}, {"false == false", true},
		{"true != false", true}, {"true == false", false},
		{"(1 < 2) == true", true}, {"(1 > 2) == false", true},
	}
	for _, tt := range tests {
		obj := testEval(tt.input)
		result, ok := obj.(*BooleanObject)
		if !ok { t.Fatalf("for %s: expected BooleanObject, got %T (%v)", tt.input, obj, obj) }
		if result.Value != tt.expected { t.Errorf("for %s: expected %t, got %t", tt.input, tt.expected, result.Value) }
	}
}

func TestInfixTypeError(t *testing.T) {
	obj := testEval("5 + true")
	errObj, ok := obj.(*ErrorObject)
	if !ok { t.Fatalf("expected ErrorObject, got %T", obj) }
	if errObj.Message == "" { t.Error("expected non-empty error message") }
}
`,
  solution: `package main
// ─── Lexer ───────────────────────────────────────────
type TokenType string
type Token struct{ Type TokenType; Literal string }
const (
	ILLEGAL="ILLEGAL"; EOF_TOKEN="EOF"; IDENT="IDENT"; INT="INT"; STRING="STRING"
	ASSIGN="="; PLUS="+"; MINUS="-"; BANG="!"; ASTERISK="*"; SLASH="/"
	LT="<"; GT=">"; EQ="=="; NOT_EQ="!="
	COMMA=","; SEMICOLON=";"; COLON=":"
	LPAREN="("; RPAREN=")"; LBRACE="{"; RBRACE="}"; LBRACKET="["; RBRACKET="]"
	FUNCTION="FUNCTION"; LET="LET"; TRUE="TRUE"; FALSE="FALSE"
	IF="IF"; ELSE="ELSE"; RETURN="RETURN"
)
var keywords = map[string]TokenType{"fn":FUNCTION,"let":LET,"true":TRUE,"false":FALSE,"if":IF,"else":ELSE,"return":RETURN}
type Lexer struct{ input string; pos,readPos int; ch byte }
func NewLexer(in string)*Lexer{ l:=&Lexer{input:in}; l.readChar(); return l }
func (l *Lexer) readChar(){ if l.readPos>=len(l.input){l.ch=0}else{l.ch=l.input[l.readPos]}; l.pos=l.readPos; l.readPos++ }
func (l *Lexer) peekChar()byte{ if l.readPos>=len(l.input){return 0}; return l.input[l.readPos] }
func (l *Lexer) skipWS(){ for l.ch==' '||l.ch=='\\t'||l.ch=='\\n'||l.ch=='\\r'{l.readChar()} }
func (l *Lexer) readIdent()string{ p:=l.pos; for isL(l.ch){l.readChar()}; return l.input[p:l.pos] }
func (l *Lexer) readNum()string{ p:=l.pos; for isD(l.ch){l.readChar()}; return l.input[p:l.pos] }
func (l *Lexer) readStr()string{ l.readChar(); p:=l.pos; for l.ch!='"'&&l.ch!=0{l.readChar()}; s:=l.input[p:l.pos]; l.readChar(); return s }
func isL(c byte)bool{ return c>='a'&&c<='z'||c>='A'&&c<='Z'||c=='_' }
func isD(c byte)bool{ return c>='0'&&c<='9' }
func (l *Lexer) NextToken() Token {
	l.skipWS(); var t Token
	switch l.ch {
	case '=': if l.peekChar()=='='{l.readChar();t=Token{EQ,"=="}}else{t=Token{ASSIGN,"="}}
	case '!': if l.peekChar()=='='{l.readChar();t=Token{NOT_EQ,"!="}}else{t=Token{BANG,"!"}}
	case '+': t=Token{PLUS,"+"}; case '-': t=Token{MINUS,"-"}
	case '*': t=Token{ASTERISK,"*"}; case '/': t=Token{SLASH,"/"}
	case '<': t=Token{LT,"<"}; case '>': t=Token{GT,">"}
	case ',': t=Token{COMMA,","}; case ';': t=Token{SEMICOLON,";"}; case ':': t=Token{COLON,":"}
	case '(': t=Token{LPAREN,"("}; case ')': t=Token{RPAREN,")"}
	case '{': t=Token{LBRACE,"{"}; case '}': t=Token{RBRACE,"}"}
	case '[': t=Token{LBRACKET,"["}; case ']': t=Token{RBRACKET,"]"}
	case '"': return Token{STRING,l.readStr()}
	case 0: t=Token{EOF_TOKEN,""}
	default:
		if isL(l.ch){lit:=l.readIdent();tp:=IDENT;if k,ok:=keywords[lit];ok{tp=k};return Token{tp,lit}}
		if isD(l.ch){return Token{INT,l.readNum()}}
		t=Token{ILLEGAL,string(l.ch)}
	}; l.readChar(); return t
}
// ─── AST ─────────────────────────────────────────────
type Node interface{ TokenLiteral()string; String()string }
type Statement interface{ Node; statementNode() }
type Expression interface{ Node; expressionNode() }
type Program struct{ Statements []Statement }
func (p *Program) TokenLiteral()string{ if len(p.Statements)>0{return p.Statements[0].TokenLiteral()};return"" }
func (p *Program) String()string{ s:="";for _,st:=range p.Statements{s+=st.String()};return s }
type LetStatement struct{ Token Token; Name *Identifier; Value Expression }
func (s *LetStatement) statementNode(){}; func (s *LetStatement) TokenLiteral()string{return s.Token.Literal}
func (s *LetStatement) String()string{return"let "+s.Name.String()+" = "+s.Value.String()+";"}
type ReturnStatement struct{ Token Token; ReturnValue Expression }
func (s *ReturnStatement) statementNode(){}; func (s *ReturnStatement) TokenLiteral()string{return s.Token.Literal}
func (s *ReturnStatement) String()string{return"return "+s.ReturnValue.String()+";"}
type ExpressionStatement struct{ Token Token; Expression Expression }
func (s *ExpressionStatement) statementNode(){}; func (s *ExpressionStatement) TokenLiteral()string{return s.Token.Literal}
func (s *ExpressionStatement) String()string{if s.Expression!=nil{return s.Expression.String()};return""}
type BlockStatement struct{ Token Token; Statements []Statement }
func (s *BlockStatement) statementNode(){}; func (s *BlockStatement) TokenLiteral()string{return s.Token.Literal}
func (s *BlockStatement) String()string{s2:="";for _,st:=range s.Statements{s2+=st.String()};return s2}
type Identifier struct{ Token Token; Value string }
func (x *Identifier) expressionNode(){}; func (x *Identifier) TokenLiteral()string{return x.Token.Literal}; func (x *Identifier) String()string{return x.Value}
type IntegerLiteral struct{ Token Token; Value int64 }
func (x *IntegerLiteral) expressionNode(){}; func (x *IntegerLiteral) TokenLiteral()string{return x.Token.Literal}; func (x *IntegerLiteral) String()string{return x.Token.Literal}
type BooleanLiteral struct{ Token Token; Value bool }
func (x *BooleanLiteral) expressionNode(){}; func (x *BooleanLiteral) TokenLiteral()string{return x.Token.Literal}; func (x *BooleanLiteral) String()string{return x.Token.Literal}
type StringLiteral struct{ Token Token; Value string }
func (x *StringLiteral) expressionNode(){}; func (x *StringLiteral) TokenLiteral()string{return x.Token.Literal}; func (x *StringLiteral) String()string{return"\\""+x.Value+"\\""}
type PrefixExpression struct{ Token Token; Operator string; Right Expression }
func (x *PrefixExpression) expressionNode(){}; func (x *PrefixExpression) TokenLiteral()string{return x.Token.Literal}
func (x *PrefixExpression) String()string{return"("+x.Operator+x.Right.String()+")"}
type InfixExpression struct{ Token Token; Left Expression; Operator string; Right Expression }
func (x *InfixExpression) expressionNode(){}; func (x *InfixExpression) TokenLiteral()string{return x.Token.Literal}
func (x *InfixExpression) String()string{return"("+x.Left.String()+" "+x.Operator+" "+x.Right.String()+")"}
type IfExpression struct{ Token Token; Condition Expression; Consequence,Alternative *BlockStatement }
func (x *IfExpression) expressionNode(){}; func (x *IfExpression) TokenLiteral()string{return x.Token.Literal}
func (x *IfExpression) String()string{s:="if "+x.Condition.String()+" "+x.Consequence.String();if x.Alternative!=nil{s+=" else "+x.Alternative.String()};return s}
type FunctionLiteral struct{ Token Token; Parameters []*Identifier; Body *BlockStatement }
func (x *FunctionLiteral) expressionNode(){}; func (x *FunctionLiteral) TokenLiteral()string{return x.Token.Literal}
func (x *FunctionLiteral) String()string{s:="fn(";for i,p:=range x.Parameters{if i>0{s+=", "};s+=p.String()};return s+") "+x.Body.String()}
type CallExpression struct{ Token Token; Function Expression; Arguments []Expression }
func (x *CallExpression) expressionNode(){}; func (x *CallExpression) TokenLiteral()string{return x.Token.Literal}
func (x *CallExpression) String()string{s:=x.Function.String()+"(";for i,a:=range x.Arguments{if i>0{s+=", "};s+=a.String()};return s+")"}
type ArrayLiteral struct{ Token Token; Elements []Expression }
func (x *ArrayLiteral) expressionNode(){}; func (x *ArrayLiteral) TokenLiteral()string{return x.Token.Literal}
func (x *ArrayLiteral) String()string{s:="[";for i,e:=range x.Elements{if i>0{s+=", "};s+=e.String()};return s+"]"}
type IndexExpression struct{ Token Token; Left,Index Expression }
func (x *IndexExpression) expressionNode(){}; func (x *IndexExpression) TokenLiteral()string{return x.Token.Literal}
func (x *IndexExpression) String()string{return"("+x.Left.String()+"["+x.Index.String()+"])"}
type HashLiteral struct{ Token Token; Pairs map[Expression]Expression }
func (x *HashLiteral) expressionNode(){}; func (x *HashLiteral) TokenLiteral()string{return x.Token.Literal}
func (x *HashLiteral) String()string{s:="{";i:=0;for k,v:=range x.Pairs{if i>0{s+=", "};s+=k.String()+":"+v.String();i++};return s+"}"}
// ─── Parser ──────────────────────────────────────────
import ("fmt";"strconv")
const (_int=iota;LOWEST;EQUALS;LESSGREATER;SUM;PRODUCT;PREFIX;CALL;INDEX)
var precedences=map[TokenType]int{EQ:EQUALS,NOT_EQ:EQUALS,LT:LESSGREATER,GT:LESSGREATER,PLUS:SUM,MINUS:SUM,SLASH:PRODUCT,ASTERISK:PRODUCT,LPAREN:CALL,LBRACKET:INDEX}
type Parser struct{l*Lexer;curToken,peekToken Token;errors[]string;prefixParseFns map[TokenType]func()Expression;infixParseFns map[TokenType]func(Expression)Expression}
func NewParser(l*Lexer)*Parser{
	p:=&Parser{l:l,errors:[]string{}}
	p.prefixParseFns=map[TokenType]func()Expression{IDENT:p.parseIdent,INT:p.parseInt,TRUE:p.parseBool,FALSE:p.parseBool,STRING:p.parseStr,BANG:p.parsePrefix,MINUS:p.parsePrefix,LPAREN:p.parseGroup,IF:p.parseIf,FUNCTION:p.parseFn,LBRACKET:p.parseArr,LBRACE:p.parseHash}
	p.infixParseFns=map[TokenType]func(Expression)Expression{PLUS:p.parseInfix,MINUS:p.parseInfix,SLASH:p.parseInfix,ASTERISK:p.parseInfix,EQ:p.parseInfix,NOT_EQ:p.parseInfix,LT:p.parseInfix,GT:p.parseInfix,LPAREN:p.parseCall,LBRACKET:p.parseIdx}
	p.nextToken();p.nextToken();return p
}
func (p *Parser)Errors()[]string{return p.errors}
func (p *Parser)nextToken(){p.curToken=p.peekToken;p.peekToken=p.l.NextToken()}
func (p *Parser)curIs(t TokenType)bool{return p.curToken.Type==t}
func (p *Parser)peekIs(t TokenType)bool{return p.peekToken.Type==t}
func (p *Parser)expectPeek(t TokenType)bool{if p.peekIs(t){p.nextToken();return true};p.errors=append(p.errors,fmt.Sprintf("expected %s, got %s",t,p.peekToken.Type));return false}
func (p *Parser)peekPrec()int{if pr,ok:=precedences[p.peekToken.Type];ok{return pr};return LOWEST}
func (p *Parser)curPrec()int{if pr,ok:=precedences[p.curToken.Type];ok{return pr};return LOWEST}
func (p *Parser) ParseProgram()*Program{prog:=&Program{};for !p.curIs(EOF_TOKEN){if s:=p.parseStmt();s!=nil{prog.Statements=append(prog.Statements,s)};p.nextToken()};return prog}
func (p *Parser)parseStmt()Statement{switch p.curToken.Type{case LET:return p.parseLet();case RETURN:return p.parseRet();default:return p.parseExprStmt()}}
func (p *Parser)parseLet()*LetStatement{s:=&LetStatement{Token:p.curToken};if !p.expectPeek(IDENT){return nil};s.Name=&Identifier{Token:p.curToken,Value:p.curToken.Literal};if !p.expectPeek(ASSIGN){return nil};p.nextToken();s.Value=p.parseExpr(LOWEST);if p.peekIs(SEMICOLON){p.nextToken()};return s}
func (p *Parser)parseRet()*ReturnStatement{s:=&ReturnStatement{Token:p.curToken};p.nextToken();s.ReturnValue=p.parseExpr(LOWEST);if p.peekIs(SEMICOLON){p.nextToken()};return s}
func (p *Parser)parseExprStmt()*ExpressionStatement{s:=&ExpressionStatement{Token:p.curToken,Expression:p.parseExpr(LOWEST)};if p.peekIs(SEMICOLON){p.nextToken()};return s}
func (p *Parser)parseExpr(prec int)Expression{pfx:=p.prefixParseFns[p.curToken.Type];if pfx==nil{return nil};left:=pfx();for !p.peekIs(SEMICOLON)&&prec<p.peekPrec(){ifx:=p.infixParseFns[p.peekToken.Type];if ifx==nil{return left};p.nextToken();left=ifx(left)};return left}
func (p *Parser)parseIdent()Expression{return &Identifier{Token:p.curToken,Value:p.curToken.Literal}}
func (p *Parser)parseInt()Expression{v,e:=strconv.ParseInt(p.curToken.Literal,0,64);if e!=nil{return nil};return &IntegerLiteral{Token:p.curToken,Value:v}}
func (p *Parser)parseBool()Expression{return &BooleanLiteral{Token:p.curToken,Value:p.curIs(TRUE)}}
func (p *Parser)parseStr()Expression{return &StringLiteral{Token:p.curToken,Value:p.curToken.Literal}}
func (p *Parser)parsePrefix()Expression{e:=&PrefixExpression{Token:p.curToken,Operator:p.curToken.Literal};p.nextToken();e.Right=p.parseExpr(PREFIX);return e}
func (p *Parser)parseInfix(left Expression)Expression{e:=&InfixExpression{Token:p.curToken,Operator:p.curToken.Literal,Left:left};pr:=p.curPrec();p.nextToken();e.Right=p.parseExpr(pr);return e}
func (p *Parser)parseGroup()Expression{p.nextToken();exp:=p.parseExpr(LOWEST);if !p.expectPeek(RPAREN){return nil};return exp}
func (p *Parser)parseIf()Expression{e:=&IfExpression{Token:p.curToken};if !p.expectPeek(LPAREN){return nil};p.nextToken();e.Condition=p.parseExpr(LOWEST);if !p.expectPeek(RPAREN){return nil};if !p.expectPeek(LBRACE){return nil};e.Consequence=p.parseBlock();if p.peekIs(ELSE){p.nextToken();if !p.expectPeek(LBRACE){return nil};e.Alternative=p.parseBlock()};return e}
func (p *Parser)parseBlock()*BlockStatement{b:=&BlockStatement{Token:p.curToken};p.nextToken();for !p.curIs(RBRACE)&&!p.curIs(EOF_TOKEN){if s:=p.parseStmt();s!=nil{b.Statements=append(b.Statements,s)};p.nextToken()};return b}
func (p *Parser)parseFn()Expression{fl:=&FunctionLiteral{Token:p.curToken};if !p.expectPeek(LPAREN){return nil};fl.Parameters=p.parseParams();if !p.expectPeek(LBRACE){return nil};fl.Body=p.parseBlock();return fl}
func (p *Parser)parseParams()[]*Identifier{ids:=[]*Identifier{};if p.peekIs(RPAREN){p.nextToken();return ids};p.nextToken();ids=append(ids,&Identifier{Token:p.curToken,Value:p.curToken.Literal});for p.peekIs(COMMA){p.nextToken();p.nextToken();ids=append(ids,&Identifier{Token:p.curToken,Value:p.curToken.Literal})};if !p.expectPeek(RPAREN){return nil};return ids}
func (p *Parser)parseCall(fn Expression)Expression{return &CallExpression{Token:p.curToken,Function:fn,Arguments:p.parseExprList(RPAREN)}}
func (p *Parser)parseExprList(end TokenType)[]Expression{list:=[]Expression{};if p.peekIs(end){p.nextToken();return list};p.nextToken();list=append(list,p.parseExpr(LOWEST));for p.peekIs(COMMA){p.nextToken();p.nextToken();list=append(list,p.parseExpr(LOWEST))};if !p.expectPeek(end){return nil};return list}
func (p *Parser)parseArr()Expression{return &ArrayLiteral{Token:p.curToken,Elements:p.parseExprList(RBRACKET)}}
func (p *Parser)parseIdx(left Expression)Expression{e:=&IndexExpression{Token:p.curToken,Left:left};p.nextToken();e.Index=p.parseExpr(LOWEST);if !p.expectPeek(RBRACKET){return nil};return e}
func (p *Parser)parseHash()Expression{h:=&HashLiteral{Token:p.curToken,Pairs:map[Expression]Expression{}};for !p.peekIs(RBRACE){p.nextToken();k:=p.parseExpr(LOWEST);if !p.expectPeek(COLON){return nil};p.nextToken();v:=p.parseExpr(LOWEST);h.Pairs[k]=v;if !p.peekIs(RBRACE)&&!p.expectPeek(COMMA){return nil}};if !p.expectPeek(RBRACE){return nil};return h}
// ─── Object System ───────────────────────────────────
type ObjectType string
const (INTEGER_OBJ ObjectType="INTEGER";BOOLEAN_OBJ ObjectType="BOOLEAN";NULL_OBJ ObjectType="NULL";ERROR_OBJ ObjectType="ERROR";RETURN_VALUE_OBJ ObjectType="RETURN_VALUE")
type Object interface{Type()ObjectType;Inspect()string}
type IntegerObject struct{Value int64}
func (o *IntegerObject)Type()ObjectType{return INTEGER_OBJ};func (o *IntegerObject)Inspect()string{return fmt.Sprintf("%d",o.Value)}
type BooleanObject struct{Value bool}
func (o *BooleanObject)Type()ObjectType{return BOOLEAN_OBJ};func (o *BooleanObject)Inspect()string{return fmt.Sprintf("%t",o.Value)}
type NullObject struct{}
func (o *NullObject)Type()ObjectType{return NULL_OBJ};func (o *NullObject)Inspect()string{return"null"}
type ErrorObject struct{Message string}
func (o *ErrorObject)Type()ObjectType{return ERROR_OBJ};func (o *ErrorObject)Inspect()string{return"ERROR: "+o.Message}
type ReturnValueObject struct{Value Object}
func (o *ReturnValueObject)Type()ObjectType{return RETURN_VALUE_OBJ};func (o *ReturnValueObject)Inspect()string{return o.Value.Inspect()}
type Environment struct{store map[string]Object;outer *Environment}
func NewEnvironment()*Environment{return &Environment{store:map[string]Object{}}}
func NewEnclosedEnvironment(outer *Environment)*Environment{e:=NewEnvironment();e.outer=outer;return e}
func (e *Environment)Get(name string)(Object,bool){o,ok:=e.store[name];if !ok&&e.outer!=nil{o,ok=e.outer.Get(name)};return o,ok}
func (e *Environment)Set(name string,val Object)Object{e.store[name]=val;return val}
// ─── Evaluator ───────────────────────────────────────
var (TRUE_OBJ=&BooleanObject{Value:true};FALSE_OBJ=&BooleanObject{Value:false};NULL=&NullObject{})
func newError(f string,a ...interface{})*ErrorObject{return &ErrorObject{Message:fmt.Sprintf(f,a...)}}
func isError(obj Object)bool{return obj!=nil&&obj.Type()==ERROR_OBJ}
func nativeBoolToBooleanObject(b bool)*BooleanObject{if b{return TRUE_OBJ};return FALSE_OBJ}

func Eval(node Node, env *Environment) Object {
	switch node := node.(type) {
	case *Program:
		return evalProgram(node, env)
	case *ExpressionStatement:
		return Eval(node.Expression, env)
	case *IntegerLiteral:
		return &IntegerObject{Value: node.Value}
	case *BooleanLiteral:
		return nativeBoolToBooleanObject(node.Value)
	case *PrefixExpression:
		right := Eval(node.Right, env)
		if isError(right) { return right }
		return evalPrefixExpression(node.Operator, right)
	case *InfixExpression:
		left := Eval(node.Left, env)
		if isError(left) { return left }
		right := Eval(node.Right, env)
		if isError(right) { return right }
		return evalInfixExpression(node.Operator, left, right)
	}
	return NULL
}

func evalProgram(program *Program, env *Environment) Object {
	var result Object
	for _, stmt := range program.Statements {
		result = Eval(stmt, env)
		if errObj, ok := result.(*ErrorObject); ok { return errObj }
	}
	return result
}

func evalPrefixExpression(op string, right Object) Object {
	switch op {
	case "!": return evalBangOperator(right)
	case "-": return evalMinusPrefix(right)
	}
	return newError("unknown operator: %s%s", op, right.Type())
}
func evalBangOperator(right Object) Object {
	switch right { case TRUE_OBJ: return FALSE_OBJ; case FALSE_OBJ: return TRUE_OBJ; case NULL: return TRUE_OBJ; default: return FALSE_OBJ }
}
func evalMinusPrefix(right Object) Object {
	if right.Type() != INTEGER_OBJ { return newError("unknown operator: -%s", right.Type()) }
	return &IntegerObject{Value: -right.(*IntegerObject).Value}
}

func evalInfixExpression(op string, left, right Object) Object {
	if left.Type() == INTEGER_OBJ && right.Type() == INTEGER_OBJ {
		return evalIntegerInfixExpression(op, left, right)
	}
	if op == "==" { return nativeBoolToBooleanObject(left == right) }
	if op == "!=" { return nativeBoolToBooleanObject(left != right) }
	if left.Type() != right.Type() {
		return newError("type mismatch: %s %s %s", left.Type(), op, right.Type())
	}
	return newError("unknown operator: %s %s %s", left.Type(), op, right.Type())
}

func evalIntegerInfixExpression(op string, left, right Object) Object {
	lv := left.(*IntegerObject).Value
	rv := right.(*IntegerObject).Value
	switch op {
	case "+": return &IntegerObject{Value: lv + rv}
	case "-": return &IntegerObject{Value: lv - rv}
	case "*": return &IntegerObject{Value: lv * rv}
	case "/": return &IntegerObject{Value: lv / rv}
	case "<": return nativeBoolToBooleanObject(lv < rv)
	case ">": return nativeBoolToBooleanObject(lv > rv)
	case "==": return nativeBoolToBooleanObject(lv == rv)
	case "!=": return nativeBoolToBooleanObject(lv != rv)
	}
	return newError("unknown operator: %s %s %s", left.Type(), op, right.Type())
}

func main() {}
`,
  hints: [
    'Evaluate left and right operands first, checking for errors after each',
    'For integer infix: type-assert both sides and switch on operator',
    'For boolean equality: use pointer comparison (left == right) since we use singletons',
    'Return type mismatch error when operand types differ (except for == and !=)',
  ],
  projectId: 'proj-monkey',
  step: 14,
  totalSteps: 22,
}

export default exercise
