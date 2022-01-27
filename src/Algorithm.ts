


export function diff_algorithm(raw_input: string[], split_eng_word = true) {
    if (raw_input.length == 0) return [];

    const root_idx = raw_input.reduce(
        (ans_idx, me, me_idx) => (me.length > raw_input[ans_idx].length) ? me_idx : ans_idx,
        0);
    if (raw_input[root_idx].length == 0) return [];

    let input = raw_input;

    let rtn: string[][] = [];
    let buf_eng = /[A-Za-z]/.test(input[root_idx][0]);

    let index: number[] = new Array(input.length).fill(0);
    let batch_match_count = 0;

    while (index[root_idx] + batch_match_count < input[root_idx].length) {
        let str_0_char = input[root_idx][index[root_idx] + batch_match_count];
        if (input.every((val, i) =>
            (val[index[i] + batch_match_count] == str_0_char) &&
            (
                split_eng_word ||
                !(
                    buf_eng != (buf_eng = /[A-Za-z]/.test(val[index[i] + batch_match_count])) &&
                    buf_eng == true
                )
            ))) {
            batch_match_count++;
            continue;
        }

        if (batch_match_count != 0)
            rtn.push([input[root_idx].substring(index[root_idx], index[root_idx] + batch_match_count)]);
        input.forEach((val, i) => index[i] += batch_match_count);
        batch_match_count = 0;

        let all_base_end = input.length;
        let the_best_find_index: number[] = [];
        let the_best_find_total = 100000000;

        input.forEach((base_str, base) => {
            let k = index[base] + 1;
            for (; k < base_str.length; k++) {
                if (!split_eng_word && /[A-Za-z]/.test(base_str[k])) continue;
                let find_index: number[] = new Array(input.length).fill(0);
                let find_total = 0;

                let all_find = input.every((val, j) => {
                    find_index[j] = val.indexOf(base_str[k], index[j]);
                    find_total = Math.max(find_total, find_index[j] - index[j]);
                    return find_index[j] != -1;
                });

                if (all_find && find_total < the_best_find_total) {
                    the_best_find_index = find_index;
                    the_best_find_total = find_total;
                    break;
                }
            }

            all_base_end -= (!(k < base_str.length)) ? 1 : 0;
        });

        if (all_base_end == 0) {
            break;
        }

        let buf: string[] = [];
        input.forEach((val, i) => buf.push(val.substring(index[i], index[i] = the_best_find_index[i])));
        rtn.push(buf);
    }

    let buf: string[] = [];
    input.forEach((val, i) => buf.push(val.substring(index[i])));
    if (buf.every((val, i) => val == buf[0]))
        rtn.push([buf[0]]);
    else
        rtn.push(buf);
    return rtn;
}