export type Tokenizer = { [name: string]: any[] };


const handles: Tokenizer = {
    handle:                     [
        {include: '@concept_handle'},
        {include: '@perspective_handle'},
        {include: '@evaluation_handle'},
        {include: '@performance_handle'},
        {include: '@channel_handle'},
        {include: '@invocation_handle'},
    ],
    concept_handle:             [[/[&](_[a-zA-Z_\d-]*)?/, {token: 'handle.concept'}]],
    perspective_handle:         [[/[@](_[a-zA-Z_\d-]*)?/, {token: 'handle.perspective'}]],
    applied_perspective_handle: [[/[@](_[a-zA-Z_\d-]*)?/, {
        token: 'handle.perspective',
        next:  '@pop',
    }]],
    evaluation_handle:          [[/[?](_[a-zA-Z_\d-]*)?/, {token: 'handle.evaluation'}]],
    performance_handle:         [[/[!](_[a-zA-Z_\d-]*)?/, {token: 'handle.performance'}]],
    channel_handle:             [[/[#](_[a-zA-Z_\d-]*)?/, {token: 'handle.channel'}]],
    invocation_handle:          [[/[~](_[a-zA-Z_\d-]*)?/, {token: 'handle.invocation'}]],
};

const linebreackchar: Tokenizer = {
    linebreackchar: [
        [/\\/, {token: 'linebreackchar'}],
    ],
}

const pivot: Tokenizer = {
    pivot: [
        [/[/]/, {token: 'pivot'}],
    ],
};

const SPACELESS_ANCHOR_REGEXP = /(?=[a-zA-Z_\-\d]*[\s\n]*[.{<\[])[a-zA-Z\d]+[a-zA-Z_\-\d]*/;
const ANCHOR_REGEXP           = /(?=([a-zA-Z\d_]+[a-zA-Z_\-\d]*)*(\W|\s|\n|$)+)[a-zA-Z\d_]+[a-zA-Z_\-\d]*/;
const INCLUSIVE_ANCHOR_REGEXP = /(?=([a-zA-Z\d@]+[a-zA-Z_\-\d]*)*(\W|\s|\n|$)+)[a-zA-Z\d@]+[a-zA-Z_\-\d]*/;
const node: Tokenizer         = {
    node_anchor: [
        [ANCHOR_REGEXP, 'anchor'],
    ],

    nested_node_anchor: [
        [SPACELESS_ANCHOR_REGEXP, {token: 'anchor.spaceless', next: '@pop'}],
        [ANCHOR_REGEXP, {token: 'anchor.nested', next: '@pop'}],
        [INCLUSIVE_ANCHOR_REGEXP, {token: 'anchor.perspective.nested', next: '@pop'}],

    ],

    node: [
        {include: '@perspective_anchor'},
        {include: '@spaceless_anchor'},
        {include: '@node_anchor'},
        {include: '@pivot'},
        {include: '@linebreackchar'},
        {include: '@handle'},
        {include: '@EXPERIMENTAL'},
        {include: '@transport'},
        {include: '@string'},
        [/[,.]/, {token: 'delimiter'}],
    ],

    perspective_anchor:       [
        [
            /(?=[a-zA-Z_\-\d]* ?@)[a-zA-Z_\-\d]+/,
            {
                token: 'anchor.perspective',
                next:  '@perspective_anchor__body',
            },
        ],
        {include: '@domain'},
    ],
    perspective_anchor__body: [
        {include: '@applied_perspective_handle'},
        {include: '@node'},
        {include: '@domain'},
    ],

    spaceless_anchor:       [
        [SPACELESS_ANCHOR_REGEXP, {token: 'anchor.spaceless', next: '@spaceless_anchor__body'}],
        {include: '@domain'},
    ],
    spaceless_anchor__body: [
        [/[.]/, {token: 'delimiter'}],
        {include: '@nested_node_anchor'},
        {include: '@spaceless_anchor'},
        {include: '@node'},
        {include: '@domain'},
    ],

    string:     [
        [/"/, {
            token: 'string.quote',
            next:  '@stringBody',
        }],
    ],
    stringBody: [
        [new RegExp('\\\\.'), 'string'],
        [new RegExp('"'), {
            token: 'string.quote',
            next:  '@pop',
        }],
        [/[^\\"]+/, 'string'],
        [new RegExp('.'), 'string'],
    ],
};
const misc: Tokenizer         = {
    EXPERIMENTAL: [
        {include: '@UNDEFINED_1'},
        {include: '@UNDEFINED_2'},
        {include: '@UNDEFINED_3'},
    ],
    UNDEFINED_1:  [
        [/([;:])/, {token: 'und.one'}],
    ],
    UNDEFINED_2:  [
        [/\*/, {token: 'und.two'}],
    ],
    UNDEFINED_3:  [],
};
const domain: Tokenizer       = {
    domain:                  [
        {include: '@delimiter'},
        {include: '@domain__open'},
    ],
    domain__open:            [
        [/\((_[\w\d]*)?/, {token: 'domain.aside', next: '@domain__body'}],
        [/([\[<{])(?:_[\w\d-]*)*/, {
            cases: {
                '$1=={': {
                    token:    'domain.instance',
                    bracket:  '@open',
                    next:     '@push',
                    switchTo: '@domain__body',
                },
                '$1==[': {
                    token:    'domain.essence',
                    bracket:  '@open',
                    next:     '@push',
                    switchTo: '@domain__body',
                },
                '$1==<': {
                    token:    'domain.concept',
                    bracket:  '@open',
                    next:     '@push',
                    switchTo: '@domain__body',
                },
            },
        }],
    ],
    domain__body:            [
        [/\s/, 'whitespace'],
        {include: '@instance_domain__closer'},
        {include: '@aside_domain__closer'},
        {include: '@essence_domain__closer'},
        {include: '@concept_domain__closer'},
        {include: '@node', action: {next: '@push'}},
    ],
    aside_domain__closer:    [[/([\w\d]*_)?\)/, {token: 'domain.aside', bracket: '@close'}]],
    essence_domain__closer:  [[/([\w\d]*_)?]/, {token: 'domain.essence', bracket: '@close'}]],
    concept_domain__closer:  [[/([\w\d]*_)?>/, {token: 'domain.concept', bracket: '@close'}]],
    instance_domain__closer: [[/([\w\d]*_)?}/, {token: 'domain.instance', bracket: '@close'}]],
};

export const tokenizer: Tokenizer =
                 {
                     root:             [
                         {include: '@linebreackchar'},
                         {include: '@transport'},
                         {include: '@domain'},
                         {include: '@EXPERIMENTAL'},
                         {include: '@node'},
                     ],
                     delimiter:        [[/[,]/, 'delimiter']],
                     whitespace_break: [[/\s/, {token: 'white', next: '@pop'}]],

                     ...domain,
                     ...misc,
                     ...node,
                     ...pivot,
                     ...linebreackchar,
                     ...handles,

                     // transport
                     transport: [
                         [/\|/, {token: 'transport'}],
                         [/[|<]?(-+|<==+|=+>?)[>|]?/, {token: 'transport'}],
                     ],
                 };

