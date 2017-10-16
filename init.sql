SET NAMES utf8;

DROP DATABASE IF EXISTS bp;

CREATE DATABASE bp;

USE bp;

GRANT SELECT, INSERT, UPDATE, DELETE ON bp.* TO 'bp'@'localhost' IDENTIFIED BY 'bp-data';

DROP TABLE IF EXISTS B_Project;

CREATE TABLE B_Project (
    id int not null auto_increment comment '主键',
    project_code varchar(255) not null comment '项目代码',
    project_name varchar(255) not null comment '项目名称',
    province varchar(255) not null comment '省份',
    city varchar(255) not null comment '城市',
    pm varchar(255) not null comment '项目负责人',
    phone_no varchar(255) not null comment '手机号码',
    create_date datetime not null default current_timestamp comment '创建时间',
    remark varchar(255) default null comment '备注',
    primary key(id),
    unique(project_code)
) ENGINE=innodb DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS B_Building;

CREATE TABLE B_Building (
    id int not null auto_increment comment '主键',
    building_code varchar(255) not null comment '建筑代码',
    building_name varchar(255) not null comment '建筑名称',
    project_code varchar(255) not null comment '所属项目',
    type int not null comment '建筑类型: 1: 楼塔|2: 桥梁|3: 隧道|4: 堤坝',
    create_date datetime not null default current_timestamp comment '创建时间',
    remark varchar(255) default null comment '备注',
    primary key(id),
    unique(building_code)
) ENGINE=innodb DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS B_Building_Unit;
CREATE TABLE B_Building_Unit (
    id int not null auto_increment comment '主键',
    unit_nmae varchar(255) not null comment '单元名称',
    building_code varchar(255) not null comment '所属建筑',
    create_date datetime not null default current_timestamp comment '创建时间',
    remark varchar(255) default null comment '备注',
    primary key(id)
) ENGINE=innodb DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS B_Upper_Monitor;
CREATE TABLE B_Upper_Monitor (
    id int not null auto_increment comment '主键',
    project_code varchar(255) not null comment '所属项目',
    monitor_code varchar(255) not null comment 'MAC地址或其他唯一编号',
    monitor_name varchar(255) not null comment '设备名称',
    state int not null comment '状态',
    create_date datetime not null default current_timestamp comment '创建时间',
    remark varchar(255) default null comment '备注',
    primary key(id),
    unique(monitor_code)
) ENGINE=innodb DEFAULT CHARSET=utf8;
