/*

TODO: Does this need to be broken out into two parsers -- ENTimeFromCasualFormatParser and ENTimeFromWeekdayParser?
TODO: This will undoubtedly require writing additional tests -- what cases need to be covered?

*/

var moment = require('moment');
var Parser = require('../parser').Parser;
var ParsedResult = require('../../result').ParsedResult;

// TODO: \W in the positive lookahead at the end seems to mean this could include nonsensical constructions like "-26 days from today" -- is this realistically a problem?
var PATTERN = /(\W|^)([0-9]+)\s*(days?|weeks?|months?|years?)\s*(from)\s*((today|tomorrow|tmr|tom|yesterday)|((last|next)?\s(Monday|Mon|Tuesday|Tue|Wednesday|Wed|Thursday|Thurs|Friday|Fri|Saturday|Sat|Sunday|Sun)))(?=(?:\W|$))/i;

exports.Parser = function ENTimeAgoFormatParser(){
    
    Parser.apply(this, arguments);

// TODO: from CasualDateParser -- required? 
//    this.pattern = function () { return PATTERN; }

// TODO: cf. extractor from CasualDateParser -- do these two need to be merged, or does one need to replace the other? Clarification needed on this logic.
// 		 NB -- see note at head of doc
    this.extract = function(text, ref, match, opt){

        if (match.index > 0 && text[match.index-1].match(/\w/)) return null;

        var text = match[0];
        text  = match[0].substr(match[1].length, match[0].length - match[1].length);
        index = match.index + match[1].length;

        var result = new ParsedResult({
            index: index,
            text: text,
            ref: ref,
        });
        
        var date = moment(ref);

/* TODO: determine if this can be safely removed, since we're not using minutes/hours

        if (match[3].match(/hour/) || match[3].match(/minute/)) {
            if (match[3].match(/hour/)) {

                date.add(-num, 'hour');
    
            } else if (match[3].match(/minute/)) {
    
                date.add(-num, 'minute');
            }
    
            result.start.imply('day', date.date());
            result.start.imply('month', date.month() + 1);
            result.start.imply('year', date.year());
            result.start.assign('hour', date.hour());
            result.start.assign('minute', date.minute());
            result.tags['ENTimeAgoFormatParser'] = true;
            return result;
        }
*/

        if (match[3].match(/weeks/)) {
            date.add(-num, 'week');

            result.start.imply('day', date.date());
            result.start.imply('month', date.month() + 1);
            result.start.imply('year', date.year());
            result.start.imply('weekday', date.day());
            return result;
        }
        
        if (match[3].match(/day/)) {
            date.add(-num, 'd');
        }

        if (match[3].match(/month/)) {
            date.add(-num, 'month');
        }

        if (match[3].match(/year/)) {

            date.add(-num, 'year');
        }

        result.start.assign('day', date.date());
        result.start.assign('month', date.month() + 1);
        result.start.assign('year', date.year());
        return result;
        
    };
}
