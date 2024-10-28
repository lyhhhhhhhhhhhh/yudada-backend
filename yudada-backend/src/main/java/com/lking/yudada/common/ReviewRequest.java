package com.lking.yudada.common;

import lombok.Data;

import java.io.Serializable;


/**
 * 审核请求
 */
@Data
public class ReviewRequest implements Serializable {

    /**
     * id
     */
    private Long id;

    /**
     * 状态 0-待审核 1-审核通过 2-审核不通过
     */
    private Integer reviewStatus;

    /**
     * 审核信息
     */
    private String reviewMessage;

    private static final long SerialVersionUID = 1L;

}
